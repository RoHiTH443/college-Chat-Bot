const fs = require('fs/promises');
const path = require('path');

const DEFAULT_DATA_DIR = path.resolve(__dirname, '../../data');
const SUPPORTED_EXTENSIONS = new Set(['.txt', '.md', '.json']);
const RAG_MAX_FILES = Number.parseInt(process.env.RAG_MAX_FILES || '3', 10);
const RAG_MAX_CHUNKS = Number.parseInt(process.env.RAG_MAX_CHUNKS || '6', 10);
const RAG_CHARS_PER_FILE = Number.parseInt(process.env.RAG_CHARS_PER_FILE || '1200', 10);
const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'how',
  'i',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'this',
  'to',
  'what',
  'when',
  'where',
  'which',
  'who',
  'why',
  'with',
  'you',
  'your',
]);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

function normalizeText(text) {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function splitIntoChunks(content) {
  if (!content || !content.trim()) return [];

  const chunks = content
    .split(/\n\s*\n+/)
    .map((section) => section.trim())
    .filter(Boolean);

  if (chunks.length > 1) return chunks;

  // Fallback: if content has almost no blank lines, split by line windows.
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const windowSize = 8;
  const stepped = [];

  for (let idx = 0; idx < lines.length; idx += windowSize) {
    const window = lines.slice(idx, idx + windowSize).join('\n');
    if (window) stepped.push(window);
  }

  return stepped;
}

function scoreChunk(queryTokens, questionNormalized, chunkText, fileName) {
  if (!queryTokens.length || !chunkText) return 0;

  const chunkTokens = tokenize(chunkText);
  if (!chunkTokens.length) return 0;

  const tokenCounts = new Map();
  for (const token of chunkTokens) {
    tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
  }

  let tokenScore = 0;
  let matchedTokenCount = 0;
  for (const token of queryTokens) {
    const count = tokenCounts.get(token) || 0;
    if (count > 0) {
      matchedTokenCount += 1;
      tokenScore += 1 + Math.min(count, 3) * 0.4;
    }
  }

  if (matchedTokenCount === 0) return 0;

  // Reward compact, focused chunks over very long sections.
  const lengthPenalty = Math.max(1, Math.sqrt(chunkTokens.length / 20));
  let score = tokenScore / lengthPenalty;

  // Boost exact phrase match.
  const chunkNormalized = normalizeText(chunkText);
  if (questionNormalized && chunkNormalized.includes(questionNormalized)) {
    score += 4;
  }

  // Prefer FAQ-like files for user questions.
  if ((fileName || '').toLowerCase().includes('faq')) {
    score += 1.5;
  }

  // Encourage high coverage of query tokens.
  score += matchedTokenCount / queryTokens.length;

  return score;
}

async function walkFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nested = await walkFiles(fullPath);
      files.push(...nested);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function loadKnowledgeFiles() {
  try {
    const allFiles = await walkFiles(DEFAULT_DATA_DIR);
    const contentFiles = allFiles.filter((filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      return SUPPORTED_EXTENSIONS.has(ext);
    });

    const loaded = await Promise.all(
      contentFiles.map(async (filePath) => {
        try {
          const content = await fs.readFile(filePath, 'utf8');
          return {
            filePath,
            fileName: path.relative(DEFAULT_DATA_DIR, filePath),
            content,
          };
        } catch {
          return null;
        }
      })
    );

    return loaded.filter(Boolean);
  } catch {
    return [];
  }
}

async function retrieveRelevantContext(question) {
  const files = await loadKnowledgeFiles();
  if (!files.length) {
    return { context: '', sources: [] };
  }

  const queryTokens = tokenize(question);
  const questionNormalized = normalizeText(question);

  if (!queryTokens.length) {
    return { context: '', sources: [] };
  }

  const chunkCandidates = [];
  for (const file of files) {
    const chunks = splitIntoChunks(file.content);
    for (const chunk of chunks) {
      const score = scoreChunk(queryTokens, questionNormalized, chunk, file.fileName);
      if (score > 0) {
        chunkCandidates.push({
          fileName: file.fileName,
          chunk,
          score,
        });
      }
    }
  }

  const maxChunks = Number.isNaN(RAG_MAX_CHUNKS) ? 6 : RAG_MAX_CHUNKS;
  const sortedChunks = chunkCandidates.sort((a, b) => b.score - a.score);
  const bestScore = sortedChunks[0]?.score || 0;
  const relevanceFloor = bestScore * 0.45;
  const topChunks = sortedChunks
    .filter((item) => item.score >= relevanceFloor)
    .slice(0, maxChunks);

  if (!topChunks.length) {
    return { context: '', sources: [] };
  }

  const maxFiles = Number.isNaN(RAG_MAX_FILES) ? 3 : RAG_MAX_FILES;
  const maxChars = Number.isNaN(RAG_CHARS_PER_FILE) ? 1200 : RAG_CHARS_PER_FILE;

  // Build sources while keeping only top chunks per selected files.
  const byFile = new Map();
  for (const item of topChunks) {
    if (!byFile.has(item.fileName) && byFile.size >= maxFiles) continue;
    const existing = byFile.get(item.fileName) || [];
    existing.push(item.chunk);
    byFile.set(item.fileName, existing);
  }

  const sources = Array.from(byFile.entries()).map(([title, chunks]) => {
    const snippet = chunks
      .join('\n\n')
      .slice(0, maxChars)
      .trim();
    return {
      title,
      snippet,
    };
  });

  const context = sources
    .map((source) => `[Source: ${source.title}]\n${source.snippet}`)
    .join('\n\n');

  return { context, sources };
}

module.exports = {
  retrieveRelevantContext,
};

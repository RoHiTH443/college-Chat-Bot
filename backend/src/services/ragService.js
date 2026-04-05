const fs = require('fs/promises');
const path = require('path');

const DEFAULT_DATA_DIR = path.resolve(__dirname, '../../data');
const SUPPORTED_EXTENSIONS = new Set(['.txt', '.md', '.json']);
const RAG_MAX_FILES = Number.parseInt(process.env.RAG_MAX_FILES || '3', 10);
const RAG_CHARS_PER_FILE = Number.parseInt(process.env.RAG_CHARS_PER_FILE || '1200', 10);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreText(queryTokens, content) {
  if (!queryTokens.length || !content) return 0;

  const contentTokens = new Set(tokenize(content));
  let score = 0;

  for (const token of queryTokens) {
    if (contentTokens.has(token)) score += 1;
  }

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

  const ranked = files
    .map((file) => ({
      ...file,
      score: scoreText(queryTokens, file.content),
    }))
    .filter((file) => file.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Number.isNaN(RAG_MAX_FILES) ? 3 : RAG_MAX_FILES);

  if (!ranked.length) {
    return { context: '', sources: [] };
  }

  const sources = ranked.map((item) => ({
    title: item.fileName,
    snippet: item.content.slice(0, Number.isNaN(RAG_CHARS_PER_FILE) ? 1200 : RAG_CHARS_PER_FILE),
  }));

  const context = sources
    .map((source) => `[Source: ${source.title}]\n${source.snippet}`)
    .join('\n\n');

  return { context, sources };
}

module.exports = {
  retrieveRelevantContext,
};

/**
 * Seed runner
 * Usage:
 *   node seed.js          → seed all collections (keeps existing data)
 *   node seed.js --fresh  → wipe collections first, then seed
 */

require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./src/models/User');
const Document = require('./src/models/Document');
const Query = require('./src/models/Query');
const ChatSession = require('./src/models/ChatSession');

const userData = require('./src/seeders/userData');
const getDocuments = require('./src/seeders/documentData');
const getQueries = require('./src/seeders/queryData');
const getChatSessions = require('./src/seeders/chatData');

const isFresh = process.argv.includes('--fresh');

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set in .env');

  await mongoose.connect(uri);
  console.log('✔  Connected to MongoDB');

  if (isFresh) {
    await Promise.all([
      User.deleteMany({}),
      Document.deleteMany({}),
      Query.deleteMany({}),
      ChatSession.deleteMany({}),
    ]);
    console.log('✔  Cleared existing data');
  }

  // ── 1. Users ──────────────────────────────────────────────────────────────
  // Insert only users whose email doesn't already exist
  const insertedUsers = [];
  for (const u of userData) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      const created = await User.create(u);
      insertedUsers.push(created);
      console.log(`   + User: ${created.name} (${created.role})`);
    } else {
      insertedUsers.push(exists);
      console.log(`   ~ User already exists: ${exists.name}`);
    }
  }

  // Build lookup maps
  const admin = insertedUsers.find((u) => u.role === 'admin');
  const studentMap = {};
  insertedUsers
    .filter((u) => u.role === 'student')
    .forEach((u) => { studentMap[u.name] = u._id; });

  console.log('✔  Users seeded');

  // ── 2. Documents ──────────────────────────────────────────────────────────
  const docData = getDocuments(admin._id);
  for (const d of docData) {
    const exists = await Document.findOne({ title: d.title });
    if (!exists) {
      await Document.create(d);
      console.log(`   + Document: ${d.title}`);
    } else {
      console.log(`   ~ Document already exists: ${d.title}`);
    }
  }
  console.log('✔  Documents seeded');

  // ── 3. Queries ────────────────────────────────────────────────────────────
  const queryData = getQueries(studentMap, admin._id);
  for (const q of queryData) {
    const exists = await Query.findOne({
      studentName: q.studentName,
      subject: q.subject,
    });
    if (!exists) {
      await Query.create(q);
      console.log(`   + Query: [${q.status}] ${q.studentName} – ${q.subject}`);
    } else {
      console.log(`   ~ Query already exists: ${q.subject}`);
    }
  }
  console.log('✔  Queries seeded');

  // ── 4. Chat Sessions ──────────────────────────────────────────────────────
  const rohithId = studentMap['ROHITH M'];
  if (rohithId) {
    const sessionData = getChatSessions(rohithId);
    for (const s of sessionData) {
      const exists = await ChatSession.findOne({
        student: rohithId,
        title: s.title,
      });
      if (!exists) {
        await ChatSession.create(s);
        console.log(`   + Chat Session: "${s.title}"`);
      } else {
        console.log(`   ~ Chat session already exists: "${s.title}"`);
      }
    }
    console.log('✔  Chat sessions seeded');
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const counts = await Promise.all([
    User.countDocuments(),
    Document.countDocuments(),
    Query.countDocuments(),
    ChatSession.countDocuments(),
  ]);

  console.log(`
┌──────────────────────────┐
│       Seed Complete      │
├──────────────┬───────────┤
│ Users        │ ${String(counts[0]).padEnd(9)} │
│ Documents    │ ${String(counts[1]).padEnd(9)} │
│ Queries      │ ${String(counts[2]).padEnd(9)} │
│ Chat Sessions│ ${String(counts[3]).padEnd(9)} │
└──────────────┴───────────┘

  Admin login   →  admin@bitsathy.ac.in  /  admin@123
  Student login →  rohit.ee23@bitsathy.ac.in  /  student@123
`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});

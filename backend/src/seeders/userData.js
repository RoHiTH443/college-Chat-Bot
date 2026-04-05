// Plain-text passwords — bcrypt hashing is handled by the User model's pre-save hook
const users = [
  // ── Admin ──
  {
    name: 'College Admin',
    email: 'admin@bitsathy.ac.in',
    password: 'admin@123',
    role: 'admin',
  },

  // ── Students ──
  {
    name: 'ROHITH M',
    email: 'rohit.ee23@bitsathy.ac.in',
    password: 'student@123',
    role: 'student',
  },
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@bitsathy.ac.in',
    password: 'student@123',
    role: 'student',
  },
  {
    name: 'Mark Smith',
    email: 'mark.smith@bitsathy.ac.in',
    password: 'student@123',
    role: 'student',
  },
  {
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@bitsathy.ac.in',
    password: 'student@123',
    role: 'student',
  },
  {
    name: 'David Chen',
    email: 'david.chen@bitsathy.ac.in',
    password: 'student@123',
    role: 'student',
  },
  {
    name: 'Linda White',
    email: 'linda.white@bitsathy.ac.in',
    password: 'student@123',
    role: 'student',
  },
];

module.exports = users;

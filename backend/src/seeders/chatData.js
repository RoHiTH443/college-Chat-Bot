// studentId of ROHITH M injected at runtime
const getChatSessions = (rohithId) => [
  {
    student: rohithId,
    title: 'Scholarship Deadlines Fall',
    lastMessageAt: new Date('2024-10-24T10:00:00'),
    messages: [
      {
        role: 'user',
        text: 'Hey ChatBot! Can you help me find the current scholarship deadlines for the Computer Science department?',
      },
      {
        role: 'bot',
        text: 'Sure! Here are the key scholarship deadlines for the Computer Science department:\n\n• Merit Scholarship – Apply by 15th November 2024\n• Need-based Aid – Apply by 30th November 2024\n• Research Fellowship – Apply by 10th December 2024\n\nMake sure to upload your income certificate and latest mark sheet. Would you like me to guide you through the application process?',
        sources: [],
      },
      {
        role: 'user',
        text: "That's great. Also, what are the library hours for this weekend?",
      },
      {
        role: 'bot',
        text: 'The library hours for this weekend are:\n\n• Saturday: 9:00 AM – 6:00 PM\n• Sunday: 10:00 AM – 4:00 PM\n\nNote: Digital resources and e-library are available 24/7 through the student portal.',
        sources: [],
      },
    ],
  },
  {
    student: rohithId,
    title: 'Library Hours During Finals',
    lastMessageAt: new Date('2024-10-20T14:00:00'),
    messages: [
      {
        role: 'user',
        text: 'What are the extended library hours during the finals week?',
      },
      {
        role: 'bot',
        text: 'During finals week, the library operates extended hours:\n\n• Monday – Friday: 7:00 AM – 11:00 PM\n• Saturday: 8:00 AM – 8:00 PM\n• Sunday: 10:00 AM – 6:00 PM\n\nStudy rooms can be booked online through the student portal up to 48 hours in advance.',
        sources: [],
      },
    ],
  },
  {
    student: rohithId,
    title: 'Roommate Selection Process',
    lastMessageAt: new Date('2024-10-15T09:30:00'),
    messages: [
      {
        role: 'user',
        text: 'How does the roommate selection process work for the hostel?',
      },
      {
        role: 'bot',
        text: 'The roommate selection process at BIT works as follows:\n\n1. Log in to the Student Portal\n2. Navigate to Hostel → Room Preferences\n3. Fill in your preferences (study habits, sleep schedule, etc.)\n4. Either search for a specific student by ID to request them as a roommate, or opt for auto-matching\n5. Both students must confirm the pairing before 20th November\n\nFor more details, contact the Hostel Warden at hostel@bitsathy.ac.in.',
        sources: [],
      },
    ],
  },
];

module.exports = getChatSessions;

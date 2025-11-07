// MongoDB initialization script
db = db.getSiblingDB('mentalhealth');

// Create collections with validation
db.createCollection('users');
db.createCollection('mood_entries');
db.createCollection('chat_sessions');
db.createCollection('exercises');
db.createCollection('exercise_progress');

// Create indexes
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.mood_entries.createIndex({ "userId": 1, "date": -1 });
db.chat_sessions.createIndex({ "userId": 1, "status": 1 });
db.exercises.createIndex({ "type": 1, "active": 1 });
db.exercise_progress.createIndex({ "userId": 1, "exerciseId": 1 });

// Insert sample exercises
db.exercises.insertMany([
  {
    title: "5-Minute Breathing Exercise",
    description: "A simple breathing technique to reduce stress and anxiety",
    type: "BREATHING",
    durationMinutes: 5,
    difficulty: "BEGINNER",
    instructions: "Find a comfortable position. Close your eyes. Breathe in slowly through your nose for 4 counts, hold for 4 counts, and exhale through your mouth for 6 counts.",
    steps: [
      "Sit or lie down in a comfortable position",
      "Close your eyes and relax your shoulders",
      "Breathe in slowly through your nose for 4 seconds",
      "Hold your breath for 4 seconds",
      "Exhale slowly through your mouth for 6 seconds",
      "Repeat for 5 minutes"
    ],
    active: true
  },
  {
    title: "Mindful Meditation",
    description: "Practice being present in the moment",
    type: "MEDITATION",
    durationMinutes: 10,
    difficulty: "BEGINNER",
    instructions: "Sit comfortably with your back straight. Focus on your breath and observe your thoughts without judgment.",
    steps: [
      "Find a quiet space and sit comfortably",
      "Set a timer for 10 minutes",
      "Close your eyes and focus on your breathing",
      "Notice thoughts as they arise without judgment",
      "Gently return focus to your breath when distracted",
      "End with a few deep breaths and open your eyes slowly"
    ],
    active: true
  },
  {
    title: "Body Scan Relaxation",
    description: "Progressive muscle relaxation technique",
    type: "MEDITATION",
    durationMinutes: 15,
    difficulty: "INTERMEDIATE",
    instructions: "Lie down comfortably. Systematically focus on different parts of your body, releasing tension.",
    steps: [
      "Lie down in a comfortable position",
      "Close your eyes and take three deep breaths",
      "Starting with your toes, tense and relax each muscle group",
      "Move slowly up through your body",
      "Notice the difference between tension and relaxation",
      "End by taking a few deep breaths"
    ],
    active: true
  },
  {
    title: "Cognitive Reframing",
    description: "Challenge and reframe negative thoughts",
    type: "CBT",
    durationMinutes: 15,
    difficulty: "INTERMEDIATE",
    instructions: "Identify a negative thought, examine the evidence, and create a balanced perspective.",
    steps: [
      "Identify a negative or distressing thought",
      "Write down the thought and how it makes you feel",
      "Challenge the thought - is it based on facts?",
      "Look for alternative explanations",
      "Create a more balanced, realistic thought",
      "Notice how your feelings change"
    ],
    active: true
  },
  {
    title: "Gratitude Journaling",
    description: "Practice gratitude to improve mental well-being",
    type: "JOURNALING",
    durationMinutes: 10,
    difficulty: "BEGINNER",
    instructions: "Write down three things you're grateful for today and why they matter to you.",
    steps: [
      "Get a journal or open a notes app",
      "Think about your day",
      "Write down 3 things you're grateful for",
      "For each item, write why it's meaningful",
      "Reflect on how these things impact your life",
      "Make this a daily practice"
    ],
    active: true
  },
  {
    title: "Gentle Yoga Stretch",
    description: "Simple yoga poses to release physical and mental tension",
    type: "PHYSICAL",
    durationMinutes: 15,
    difficulty: "BEGINNER",
    instructions: "Perform gentle stretches and yoga poses to connect mind and body.",
    steps: [
      "Find a quiet space with a yoga mat",
      "Start with child's pose for 2 minutes",
      "Move into cat-cow stretches",
      "Practice downward dog",
      "End with corpse pose for relaxation",
      "Focus on your breath throughout"
    ],
    active: true
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Systematically tense and relax muscle groups",
    type: "PHYSICAL",
    durationMinutes: 20,
    difficulty: "BEGINNER",
    instructions: "Tense each muscle group for 5 seconds, then release and notice the relaxation.",
    steps: [
      "Sit or lie down comfortably",
      "Start with your feet - tense for 5 seconds, release",
      "Move to calves, thighs, abdomen, etc.",
      "Continue up through your entire body",
      "Notice the feeling of relaxation in each area",
      "End with a full body scan"
    ],
    active: true
  },
  {
    title: "Loving-Kindness Meditation",
    description: "Cultivate compassion for yourself and others",
    type: "MEDITATION",
    durationMinutes: 12,
    difficulty: "INTERMEDIATE",
    instructions: "Send positive wishes to yourself and others through guided meditation.",
    steps: [
      "Sit comfortably and close your eyes",
      "Start by directing kind wishes to yourself",
      "Repeat phrases like 'May I be happy, may I be healthy'",
      "Extend these wishes to loved ones",
      "Then to neutral people, and even difficult people",
      "End by extending kindness to all beings"
    ],
    active: true
  }
]);

print("Database initialized successfully with sample exercises!");

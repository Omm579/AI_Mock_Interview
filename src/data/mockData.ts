import { User, InterviewDomain, Interview, Question } from '../types';

export const mockUser: User = {
  id: 'user123',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://i.pravatar.cc/150?img=12',
  createdAt: new Date().toISOString(),
};

export const mockDomains: InterviewDomain[] = [
  {
    id: 'web-dev',
    name: 'Web Development',
    description: 'Frontend and backend web development questions',
    icon: 'Code',
    difficultyLevels: [
      {
        id: 'beginner',
        name: 'Beginner',
        description: 'Basic concepts and fundamentals',
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        description: 'Advanced concepts and practical scenarios',
      },
      {
        id: 'expert',
        name: 'Expert',
        description: 'Complex problem-solving and architecture design',
      },
    ],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Statistics, machine learning, and data analysis',
    icon: 'BarChart',
    difficultyLevels: [
      {
        id: 'beginner',
        name: 'Beginner',
        description: 'Basic concepts and fundamentals',
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        description: 'Advanced concepts and practical scenarios',
      },
      {
        id: 'expert',
        name: 'Expert',
        description: 'Complex problem-solving and advanced techniques',
      },
    ],
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Development',
    description: 'iOS, Android, and cross-platform development',
    icon: 'Smartphone',
    difficultyLevels: [
      {
        id: 'beginner',
        name: 'Beginner',
        description: 'Basic mobile development concepts',
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        description: 'Advanced app development techniques',
      },
      {
        id: 'expert',
        name: 'Expert',
        description: 'Complex mobile architecture and optimization',
      },
    ],
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    description: 'AWS, Azure, and cloud architecture',
    icon: 'Cloud',
    difficultyLevels: [
      {
        id: 'beginner',
        name: 'Beginner',
        description: 'Cloud basics and fundamentals',
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        description: 'Advanced cloud services and deployment',
      },
      {
        id: 'expert',
        name: 'Expert',
        description: 'Complex cloud architecture and security',
      },
    ],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Network security and ethical hacking',
    icon: 'Shield',
    difficultyLevels: [
      {
        id: 'beginner',
        name: 'Beginner',
        description: 'Security fundamentals',
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        description: 'Advanced security techniques',
      },
      {
        id: 'expert',
        name: 'Expert',
        description: 'Complex security architecture',
      },
    ],
  },
  // Add more domains here...
];

export const mockQuestions: Record<string, Question[]> = {
  'web-dev': [
    {
      id: 'q1',
      text: 'Explain the concept of React hooks and their advantages over class components.',
      domain: 'web-dev',
      difficulty: 'intermediate',
      sampleAnswer: 'React hooks are functions that allow you to use state and other React features in functional components. They were introduced in React 16.8 to simplify component logic and promote code reuse. Key advantages include:\n\n1. Simpler code structure\n2. Better code reuse through custom hooks\n3. Avoiding wrapper hell from render props and HOCs\n4. Consistent behavior across components\n\nCommon hooks include useState for state management, useEffect for side effects, and useContext for context consumption.',
      keyPoints: [
        'Understanding of hooks concept',
        'Knowledge of key benefits',
        'Familiarity with common hooks',
        'Practical application examples'
      ]
    },
    {
      id: 'q2',
      text: 'What is the Virtual DOM in React and how does it improve performance?',
      domain: 'web-dev',
      difficulty: 'intermediate',
      sampleAnswer: 'The Virtual DOM is a lightweight copy of the actual DOM that React maintains in memory. When state changes occur, React first updates the Virtual DOM and then compares it with the previous version using a diffing algorithm. Only the necessary changes are then applied to the actual DOM, minimizing expensive DOM operations.\n\nThis process, known as reconciliation, makes React applications more efficient by:\n1. Batching multiple DOM updates\n2. Reducing direct DOM manipulation\n3. Cross-browser consistency\n4. Efficient update processing',
      keyPoints: [
        'Understanding of Virtual DOM concept',
        'Knowledge of reconciliation process',
        'Performance benefits explanation',
        'Real-world application'
      ]
    },
    // Add more web development questions...
  ],
  'data-science': [
    {
      id: 'q3',
      text: 'Explain the difference between supervised and unsupervised learning with examples.',
      domain: 'data-science',
      difficulty: 'beginner',
      sampleAnswer: 'Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data. In supervised learning, the algorithm learns from input-output pairs (e.g., classifying emails as spam/not spam based on labeled examples). Unsupervised learning discovers hidden patterns without labeled outputs (e.g., customer segmentation based on purchasing behavior).\n\nExamples:\nSupervised: Classification (spam detection), Regression (price prediction)\nUnsupervised: Clustering (customer segmentation), Dimensionality reduction (PCA)',
      keyPoints: [
        'Clear distinction between types',
        'Relevant examples',
        'Understanding of applications',
        'Technical accuracy'
      ]
    },
    // Add more data science questions...
  ],
  'mobile-dev': [
    {
      id: 'q4',
      text: 'Compare and contrast native vs cross-platform mobile development approaches.',
      domain: 'mobile-dev',
      difficulty: 'intermediate',
      sampleAnswer: 'Native development involves building apps specifically for iOS (Swift/Objective-C) or Android (Kotlin/Java), while cross-platform development uses frameworks like React Native or Flutter to build apps that work on multiple platforms.\n\nNative Pros:\n- Better performance\n- Full platform features\n- Better user experience\n\nCross-platform Pros:\n- Faster development\n- Code reusability\n- Lower cost\n- Easier maintenance',
      keyPoints: [
        'Understanding of both approaches',
        'Pros and cons analysis',
        'Framework knowledge',
        'Real-world considerations'
      ]
    },
    // Add more mobile development questions...
  ],
  // Add more domains and questions...
};

export const mockInterviews: Interview[] = [
  // Existing mock interviews...
];
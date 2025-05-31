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
    id: 'domain1',
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
    id: 'domain2',
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
    id: 'domain3',
    name: 'Product Management',
    description: 'Product strategy, roadmap planning, and feature prioritization',
    icon: 'Briefcase',
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
        description: 'Complex problem-solving and strategy development',
      },
    ],
  },
  {
    id: 'domain4',
    name: 'UX Design',
    description: 'User research, interaction design, and usability testing',
    icon: 'Palette',
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
        description: 'Complex problem-solving and design systems',
      },
    ],
  },
  {
    id: 'domain5',
    name: 'DevOps',
    description: 'Continuous integration, deployment, and infrastructure management',
    icon: 'Server',
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
        description: 'Complex problem-solving and infrastructure design',
      },
    ],
  },
];

export const mockQuestions: Record<string, Question[]> = {
  'domain1': [
    {
      id: 'q1',
      text: 'Explain the difference between localStorage and sessionStorage in web browsers.',
      domain: 'domain1',
      difficulty: 'beginner',
    },
    {
      id: 'q2',
      text: 'What are React hooks and how do they improve component development?',
      domain: 'domain1',
      difficulty: 'intermediate',
    },
    {
      id: 'q3',
      text: 'Describe how you would architect a scalable web application that needs to handle millions of users.',
      domain: 'domain1',
      difficulty: 'expert',
    },
    {
      id: 'q4',
      text: 'What is the difference between client-side and server-side rendering?',
      domain: 'domain1',
      difficulty: 'intermediate',
    },
    {
      id: 'q5',
      text: 'Explain how CORS (Cross-Origin Resource Sharing) works and how to handle CORS issues.',
      domain: 'domain1',
      difficulty: 'intermediate',
    },
  ],
  'domain2': [
    {
      id: 'q6',
      text: 'What is the difference between supervised and unsupervised learning?',
      domain: 'domain2',
      difficulty: 'beginner',
    },
    {
      id: 'q7',
      text: 'Explain how gradient boosting algorithms work and when you would use them.',
      domain: 'domain2',
      difficulty: 'intermediate',
    },
    {
      id: 'q8',
      text: 'How would you design an anomaly detection system for real-time network traffic?',
      domain: 'domain2',
      difficulty: 'expert',
    },
  ],
};

export const mockInterviews: Interview[] = [
  {
    id: 'interview1',
    session: {
      id: 'session1',
      userId: 'user123',
      domainId: 'domain1',
      difficultyId: 'intermediate',
      status: 'completed',
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      questions: [mockQuestions['domain1'][1], mockQuestions['domain1'][3]],
      answers: [
        {
          id: 'answer1',
          questionId: 'q2',
          text: 'React hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 and help simplify component logic.',
          feedback: {
            score: 75,
            strengths: ['Basic understanding is correct', 'Mentioned when hooks were introduced'],
            improvements: ['Could elaborate more on specific hooks', 'No mention of rules of hooks'],
            summary: 'Good basic answer but lacks depth and examples.'
          },
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
        },
        {
          id: 'answer2',
          questionId: 'q4',
          text: 'Client-side rendering happens in the browser while server-side rendering happens on the server before sending to the browser. CSR is good for interactive apps but has SEO challenges.',
          feedback: {
            score: 80,
            strengths: ['Clear distinction between CSR and SSR', 'Mentioned SEO implications'],
            improvements: ['Could discuss performance implications', 'No mention of hydration or first contentful paint'],
            summary: 'Good answer that covers the fundamentals but could go deeper into technical aspects.'
          },
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
        }
      ],
      totalScore: 78,
      summary: {
        strengths: ['Good basic understanding of web technologies', 'Clear communication style'],
        improvements: ['Need more technical depth in answers', 'Should provide more concrete examples'],
        overallFeedback: 'You have a solid foundation in web development concepts but should focus on deepening your technical knowledge and providing more specific examples in your answers.'
      }
    },
    domain: 'Web Development',
    difficulty: 'Intermediate',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString(),
    score: 78
  },
  {
    id: 'interview2',
    session: {
      id: 'session2',
      userId: 'user123',
      domainId: 'domain2',
      difficultyId: 'beginner',
      status: 'completed',
      startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
      questions: [mockQuestions['domain2'][0]],
      answers: [
        {
          id: 'answer3',
          questionId: 'q6',
          text: 'Supervised learning uses labeled data to train models while unsupervised learning discovers patterns in unlabeled data. Supervised learning is used for classification and regression, while unsupervised is used for clustering and association.',
          feedback: {
            score: 85,
            strengths: ['Clear explanation of both concepts', 'Mentioned use cases for both'],
            improvements: ['Could provide specific examples of algorithms', 'No mention of semi-supervised learning'],
            summary: 'Strong answer that shows good understanding of the fundamental concepts.'
          },
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
        }
      ],
      totalScore: 85,
      summary: {
        strengths: ['Good understanding of ML fundamentals', 'Clear and concise explanations'],
        improvements: ['Should provide more specific examples', 'Could connect concepts to real-world applications'],
        overallFeedback: 'You have a good grasp of basic data science concepts. To improve, focus on connecting theoretical knowledge with practical applications and be ready to provide specific examples of algorithms and use cases.'
      }
    },
    domain: 'Data Science',
    difficulty: 'Beginner',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(),
    score: 85
  }
];
import { Question, Feedback, InterviewDomain, DifficultyLevel } from '../types';
import { mockQuestions } from '../data/mockData';
import { geminiService } from './geminiService';

export const mockAIService = {
  async getQuestions(domainId: string, difficultyId: string, count = 5): Promise<Question[]> {
    const domainQuestions = mockQuestions[domainId] || [];
    const filteredQuestions = domainQuestions.filter(q => q.difficulty === difficultyId);
    
    const questionsToReturn = filteredQuestions.length >= count 
      ? filteredQuestions 
      : domainQuestions;
    
    return shuffle(questionsToReturn).slice(0, count);
  },

  async generateFeedback(question: Question, answer: string): Promise<Feedback> {
    try {
      return await geminiService.analyzeFeedback(
        question.text,
        answer,
        question.sampleAnswer,
        question.keyPoints
      );
    } catch (error) {
      console.error('Gemini feedback failed, falling back to mock feedback:', error);
      return this.generateMockFeedback(question, answer);
    }
  },

  generateMockFeedback(question: Question, answer: string): Feedback {
    // Simulate processing time
    const minLength = 50;
    const optimalLength = 200;
    let score = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];
    
    // Compare with sample answer key points
    const keyPoints = question.keyPoints || [];
    const sampleAnswer = question.sampleAnswer || '';
    
    if (answer.length >= minLength) {
      score += 20;
      strengths.push('Provided a substantial response');
    } else {
      improvements.push('Response could be more detailed');
    }
    
    // Check for key technical terms
    const technicalTerms = sampleAnswer.toLowerCase().match(/\b\w+\b/g) || [];
    const userTerms = answer.toLowerCase().match(/\b\w+\b/g) || [];
    const termOverlap = technicalTerms.filter(term => userTerms.includes(term)).length;
    
    score += Math.min(40, (termOverlap / technicalTerms.length) * 40);
    
    if (termOverlap > technicalTerms.length * 0.7) {
      strengths.push('Demonstrated strong technical knowledge');
    } else {
      improvements.push('Could include more technical terminology');
    }
    
    // Check for structure and clarity
    if (answer.includes('example') || answer.includes('instance')) {
      score += 20;
      strengths.push('Provided practical examples');
    } else {
      improvements.push('Could benefit from specific examples');
    }
    
    // Check for completeness
    const coveredPoints = keyPoints.filter(point => 
      answer.toLowerCase().includes(point.toLowerCase())
    ).length;
    
    score += Math.min(20, (coveredPoints / keyPoints.length) * 20);
    
    if (coveredPoints >= keyPoints.length * 0.7) {
      strengths.push('Covered most key aspects of the topic');
    } else {
      improvements.push('Could address more key aspects of the topic');
    }
    
    // Ensure score is between 0 and 100
    score = Math.min(100, Math.max(0, Math.round(score)));
    
    // Generate appropriate summary based on score
    let summary = '';
    if (score >= 90) {
      summary = 'Excellent answer demonstrating comprehensive understanding and practical knowledge.';
    } else if (score >= 80) {
      summary = 'Strong answer with good technical depth. Minor improvements possible.';
    } else if (score >= 70) {
      summary = 'Good answer showing basic understanding. Could be enhanced with more detail and examples.';
    } else {
      summary = 'Answer shows some understanding but needs significant improvement in depth and technical accuracy.';
    }
    
    return {
      score,
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 3),
      summary
    };
  },

  async generateSessionSummary(domainId: string, answers: { question: Question, answer: string, feedback: Feedback }[]): Promise<{
    strengths: string[];
    improvements: string[];
    overallFeedback: string;
  }> {
    const totalScore = answers.reduce((sum, item) => sum + item.feedback.score, 0);
    const averageScore = Math.round(totalScore / answers.length);
    
    const allStrengths = answers.flatMap(item => item.feedback.strengths);
    const allImprovements = answers.flatMap(item => item.feedback.improvements);
    
    const strengthCounts = countOccurrences(allStrengths);
    const improvementCounts = countOccurrences(allImprovements);
    
    const topStrengths = Object.entries(strengthCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([strength]) => strength);
    
    const topImprovements = Object.entries(improvementCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([improvement]) => improvement);
    
    let overallFeedback = '';
    if (averageScore >= 90) {
      overallFeedback = `Excellent performance in this ${this.getDomainName(domainId)} interview! Your answers demonstrated strong technical knowledge and communication skills. You're well-prepared for real interviews in this field.`;
    } else if (averageScore >= 80) {
      overallFeedback = `Good performance in this ${this.getDomainName(domainId)} interview. You have solid knowledge but could improve in a few areas. With some additional preparation, you should perform well in real interviews.`;
    } else if (averageScore >= 70) {
      overallFeedback = `Satisfactory performance in this ${this.getDomainName(domainId)} interview. While you covered the basics, there are several areas where you could deepen your knowledge and improve your responses.`;
    } else {
      overallFeedback = `This ${this.getDomainName(domainId)} interview revealed several areas for improvement. We recommend focusing on strengthening your fundamentals and practicing more before a real interview.`;
    }
    
    return {
      strengths: topStrengths,
      improvements: topImprovements,
      overallFeedback
    };
  },

  async generateNextQuestion(domainId: string, difficultyId: string, previousQuestions: Question[] = []): Promise<Question> {
    try {
      const domain = this.getDomainName(domainId);
      const { text, sampleAnswer, keyPoints } = await geminiService.generateQuestion(domain, difficultyId);
      
      return {
        id: `generated-${Date.now()}`,
        text,
        domain: domainId,
        difficulty: difficultyId,
        sampleAnswer,
        keyPoints,
      };
    } catch (error) {
      console.error('Gemini question generation failed, falling back to mock questions:', error);
      return this.generateMockQuestion(domainId, difficultyId);
    }
  },

  generateMockQuestion(domainId: string, difficultyId: string): Question {
    const domain = this.getDomainName(domainId);
    const questions = {
      beginner: [
        `Explain the fundamental concepts of ${domain}`,
        `What are the key tools used in ${domain}?`,
        `Describe the basic workflow in ${domain}`,
      ],
      intermediate: [
        `How would you implement a complex feature in ${domain}?`,
        `Discuss the best practices in ${domain}`,
        `Compare different approaches in ${domain}`,
      ],
      expert: [
        `Design a scalable system for ${domain}`,
        `How would you optimize performance in ${domain}?`,
        `Solve a complex problem in ${domain}`,
      ],
    };
    
    const questionList = questions[difficultyId as keyof typeof questions];
    const randomQuestion = questionList[Math.floor(Math.random() * questionList.length)];
    
    return {
      id: `generated-${Date.now()}`,
      text: randomQuestion,
      domain: domainId,
      difficulty: difficultyId,
      sampleAnswer: 'This is a dynamically generated question. The answer should demonstrate understanding of the domain and difficulty level.',
      keyPoints: ['Technical knowledge', 'Practical application', 'Problem-solving approach', 'Best practices'],
    };
  },

  getDomainName(domainId: string): string {
    const domains: Record<string, string> = {
      'web-dev': 'Web Development',
      'data-science': 'Data Science',
      'mobile-dev': 'Mobile Development',
      'cloud-computing': 'Cloud Computing',
      'cybersecurity': 'Cybersecurity',
    };
    return domains[domainId] || 'Technical';
  }
};

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function countOccurrences<T extends string>(items: T[]): Record<T, number> {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}
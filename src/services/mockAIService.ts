import { Question, Feedback, InterviewDomain, DifficultyLevel } from '../types';
import { mockQuestions } from '../data/mockData';

// This service simulates AI interactions
export const mockAIService = {
  // Get questions based on domain and difficulty
  async getQuestions(domainId: string, difficultyId: string, count = 5): Promise<Question[]> {
    // In a real app, this would call an AI API
    // For this mock, we'll return predefined questions
    const domainQuestions = mockQuestions[domainId] || [];
    const filteredQuestions = domainQuestions.filter(q => q.difficulty === difficultyId);
    
    // If we don't have enough questions for the specified difficulty, return questions regardless of difficulty
    const questionsToReturn = filteredQuestions.length >= count 
      ? filteredQuestions 
      : domainQuestions;
    
    // Shuffle and return requested number of questions
    return shuffle(questionsToReturn).slice(0, count);
  },

  // Generate feedback for an answer
  async generateFeedback(question: Question, answer: string): Promise<Feedback> {
    // In a real app, this would send the question and answer to an AI API
    // For this mock, we'll simulate feedback generation
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate random score between 60 and 95
    const score = Math.floor(Math.random() * 36) + 60;
    
    // Simple mock feedback based on answer length and content
    let strengths = [];
    let improvements = [];
    
    if (answer.length > 100) {
      strengths.push('Provided a detailed response');
    } else {
      improvements.push('Answer could be more detailed');
    }
    
    if (answer.includes('example')) {
      strengths.push('Included practical examples');
    } else {
      improvements.push('Could benefit from concrete examples');
    }
    
    if (answer.includes('advantage') || answer.includes('benefit')) {
      strengths.push('Discussed advantages/benefits');
    } else {
      improvements.push('Consider discussing advantages/benefits');
    }
    
    if (answer.includes('disadvantage') || answer.includes('limitation')) {
      strengths.push('Addressed limitations');
    } else {
      improvements.push('Could address potential limitations');
    }
    
    // Add a random strength
    const additionalStrengths = [
      'Clear and concise explanation',
      'Good technical accuracy',
      'Well-structured response',
      'Demonstrated good understanding of concepts',
    ];
    
    strengths.push(additionalStrengths[Math.floor(Math.random() * additionalStrengths.length)]);
    
    // Add a random improvement
    const additionalImprovements = [
      'Could use more technical terminology',
      'Consider addressing edge cases',
      'Could connect concepts to real-world applications',
      'Consider the performance implications',
    ];
    
    improvements.push(additionalImprovements[Math.floor(Math.random() * additionalImprovements.length)]);
    
    // Limit to max 3 strengths and 3 improvements
    strengths = strengths.slice(0, 3);
    improvements = improvements.slice(0, 3);
    
    // Generate summary based on score
    let summary = '';
    if (score >= 90) {
      summary = 'Excellent answer that demonstrates strong understanding of the subject.';
    } else if (score >= 80) {
      summary = 'Good answer with solid understanding. A few areas could be improved.';
    } else if (score >= 70) {
      summary = 'Satisfactory answer that covers basics but lacks depth in some areas.';
    } else {
      summary = 'Basic answer that needs improvement in several areas.';
    }
    
    return {
      score,
      strengths,
      improvements,
      summary
    };
  },
  
  // Generate a final summary for the entire interview
  async generateSessionSummary(domainId: string, answers: { question: Question, answer: string, feedback: Feedback }[]): Promise<{
    strengths: string[];
    improvements: string[];
    overallFeedback: string;
  }> {
    // In a real app, this would analyze all answers and provide comprehensive feedback
    // For this mock, we'll generate a simple summary
    
    // Calculate average score
    const totalScore = answers.reduce((sum, item) => sum + item.feedback.score, 0);
    const averageScore = Math.round(totalScore / answers.length);
    
    // Collect all strengths and improvements
    const allStrengths = answers.flatMap(item => item.feedback.strengths);
    const allImprovements = answers.flatMap(item => item.feedback.improvements);
    
    // Count occurrences of each strength and improvement
    const strengthCounts = countOccurrences(allStrengths);
    const improvementCounts = countOccurrences(allImprovements);
    
    // Sort by count and take top 3
    const topStrengths = Object.entries(strengthCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([strength]) => strength);
    
    const topImprovements = Object.entries(improvementCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([improvement]) => improvement);
    
    // Generate overall feedback based on average score
    let overallFeedback = '';
    if (averageScore >= 90) {
      overallFeedback = `Excellent performance in this ${getDomainName(domainId)} interview! Your answers demonstrated strong technical knowledge and communication skills. You're well-prepared for real interviews in this field.`;
    } else if (averageScore >= 80) {
      overallFeedback = `Good performance in this ${getDomainName(domainId)} interview. You have solid knowledge but could improve in a few areas. With some additional preparation, you should perform well in real interviews.`;
    } else if (averageScore >= 70) {
      overallFeedback = `Satisfactory performance in this ${getDomainName(domainId)} interview. While you covered the basics, there are several areas where you could deepen your knowledge and improve your responses.`;
    } else {
      overallFeedback = `This ${getDomainName(domainId)} interview revealed several areas for improvement. We recommend focusing on strengthening your fundamentals and practicing more before a real interview.`;
    }
    
    return {
      strengths: topStrengths,
      improvements: topImprovements,
      overallFeedback
    };
  },
  
  // Simulate AI question generation
  async generateNextQuestion(domainId: string, difficultyId: string, previousQuestions: Question[] = []): Promise<Question> {
    const availableQuestions = await this.getQuestions(domainId, difficultyId, 10);
    const previousQuestionIds = previousQuestions.map(q => q.id);
    const newQuestions = availableQuestions.filter(q => !previousQuestionIds.includes(q.id));
    
    if (newQuestions.length === 0) {
      // If we've exhausted all questions, create a generic one
      return {
        id: `generated-${Date.now()}`,
        text: `Can you explain a complex ${getDomainName(domainId)} concept that you've worked with recently?`,
        domain: domainId,
        difficulty: difficultyId,
      };
    }
    
    return newQuestions[0];
  }
};

// Helper function to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper function to count occurrences
function countOccurrences<T extends string>(items: T[]): Record<T, number> {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

// Helper function to get domain name
function getDomainName(domainId: string): string {
  switch (domainId) {
    case 'domain1': return 'Web Development';
    case 'domain2': return 'Data Science';
    case 'domain3': return 'Product Management';
    case 'domain4': return 'UX Design';
    case 'domain5': return 'DevOps';
    default: return 'Technical';
  }
}
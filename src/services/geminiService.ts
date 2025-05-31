import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const geminiService = {
  async generateQuestion(domain: string, difficulty: string): Promise<{
    text: string;
    sampleAnswer: string;
    keyPoints: string[];
  }> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a ${difficulty} level interview question for ${domain} with a sample answer and key points to look for in the response. Format the response as JSON with the following structure:
    {
      "question": "the interview question",
      "sampleAnswer": "detailed sample answer",
      "keyPoints": ["key point 1", "key point 2", "key point 3", "key point 4"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text);
      return {
        text: parsed.question,
        sampleAnswer: parsed.sampleAnswer,
        keyPoints: parsed.keyPoints,
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      throw new Error('Failed to generate question');
    }
  },

  async analyzeFeedback(question: string, answer: string, sampleAnswer: string, keyPoints: string[]): Promise<{
    score: number;
    strengths: string[];
    improvements: string[];
    summary: string;
  }> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this interview answer and provide feedback. Format the response as JSON.

Question: ${question}
Sample Answer: ${sampleAnswer}
Key Points to Look For: ${keyPoints.join(', ')}
User's Answer: ${answer}

Provide feedback in this JSON structure:
{
  "score": (number between 0-100),
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "summary": "overall feedback summary"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse Gemini feedback:', error);
      throw new Error('Failed to generate feedback');
    }
  }
};
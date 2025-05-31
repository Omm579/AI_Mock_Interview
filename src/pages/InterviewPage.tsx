import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import DomainSelector from '../components/interview/DomainSelector';
import InterviewSession from '../components/interview/InterviewSession';
import SessionSummary from '../components/interview/SessionSummary';
import { Question, Answer, InterviewSession as IInterviewSession } from '../types';
import { mockAIService } from '../services/mockAIService';

const InterviewPage: React.FC = () => {
  const { user, domains, setCurrentSession } = useAppContext();
  const [stage, setStage] = useState<'select' | 'interview' | 'summary'>('select');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [session, setSession] = useState<IInterviewSession | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check for domain param in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const domainParam = params.get('domain');
    if (domainParam) {
      setSelectedDomain(domainParam);
      // Don't set stage yet, wait for difficulty selection
    }
  }, [location]);

  const handleSelectDomain = (domainId: string, difficultyId: string) => {
    setSelectedDomain(domainId);
    setSelectedDifficulty(difficultyId);
    
    // Create a new session
    const newSession: IInterviewSession = {
      id: `session-${Date.now()}`,
      userId: user?.id || 'guest',
      domainId,
      difficultyId,
      status: 'in-progress',
      startTime: new Date().toISOString(),
      questions: [],
      answers: [],
    };
    
    setSession(newSession);
    setStage('interview');
  };

  const handleCompleteInterview = async (questions: Question[], answers: Answer[]) => {
    if (!session) return;
    
    // Update session with results
    const updatedSession: IInterviewSession = {
      ...session,
      questions,
      answers,
      status: 'completed',
      endTime: new Date().toISOString(),
    };
    
    // Generate summary
    try {
      const answerData = answers.map((answer, index) => ({
        question: questions[index],
        answer: answer.text,
        feedback: answer.feedback,
      }));
      
      const summary = await mockAIService.generateSessionSummary(selectedDomain, answerData);
      
      // Calculate total score
      const totalScore = Math.round(
        answers.reduce((sum, answer) => sum + answer.feedback.score, 0) / answers.length
      );
      
      const finalSession: IInterviewSession = {
        ...updatedSession,
        totalScore,
        summary,
      };
      
      setSession(finalSession);
      setCurrentSession(finalSession);
      setStage('summary');
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const handleRetry = () => {
    setStage('select');
    setSelectedDomain('');
    setSelectedDifficulty('');
    setSession(null);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-8">
      <div className="container-custom">
        {stage === 'select' && (
          <DomainSelector 
            domains={domains} 
            onSelectDomain={handleSelectDomain} 
          />
        )}
        
        {stage === 'interview' && selectedDomain && selectedDifficulty && (
          <InterviewSession
            domainId={selectedDomain}
            difficultyId={selectedDifficulty}
            onComplete={handleCompleteInterview}
          />
        )}
        
        {stage === 'summary' && session && (
          <SessionSummary
            session={session}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
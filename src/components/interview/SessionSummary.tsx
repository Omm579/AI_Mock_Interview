import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Award } from 'lucide-react';
import { InterviewSession } from '../../types';

interface SessionSummaryProps {
  session: InterviewSession;
  onRetry: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ session, onRetry }) => {
  const navigate = useNavigate();
  
  const getTotalScore = () => {
    if (!session.answers.length) return 0;
    
    const sum = session.answers.reduce((total, answer) => total + answer.feedback.score, 0);
    return Math.round(sum / session.answers.length);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 75) return 'text-accent-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-error-500';
  };

  return (
    <div className="card max-w-3xl mx-auto animate-fade-in">
      <div className="p-6 border-b">
        <h2 className="heading-2 text-center">Interview Summary</h2>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-4">
            <span className={`text-3xl font-bold ${getScoreColor(getTotalScore())}`}>
              {getTotalScore()}%
            </span>
          </div>
          <h3 className="heading-3 mb-1">Overall Performance</h3>
          <p className="text-gray-600 text-center">
            Based on {session.answers.length} questions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-4 border">
            <h4 className="text-lg font-medium flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
              Key Strengths
            </h4>
            <ul className="space-y-2">
              {session.summary?.strengths.map((strength, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="text-success-500 mr-2">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="card p-4 border">
            <h4 className="text-lg font-medium flex items-center mb-3">
              <XCircle className="h-5 w-5 text-error-500 mr-2" />
              Areas to Improve
            </h4>
            <ul className="space-y-2">
              {session.summary?.improvements.map((improvement, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="text-error-500 mr-2">•</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 p-5 rounded-lg mb-8">
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <Award className="h-5 w-5 text-primary-500 mr-2" />
            Overall Feedback
          </h4>
          <p className="text-gray-700">{session.summary?.overallFeedback}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-outline flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </button>
          <button 
            onClick={onRetry} 
            className="btn btn-primary flex items-center justify-center"
          >
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { InterviewSession } from '../types';
import { mockInterviews } from '../data/mockData';

const FeedbackPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, this would fetch the session from an API
    const loadSession = () => {
      setLoading(true);
      try {
        const foundSession = mockInterviews.find(
          interview => interview.session.id === sessionId
        )?.session;
        
        if (foundSession) {
          setSession(foundSession);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSession();
  }, [sessionId]);
  
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-error-500 mx-auto mb-4" />
          <h2 className="heading-2 mb-4">Interview Session Not Found</h2>
          <p className="text-gray-600 mb-8">
            The interview session you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(session.startTime).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  const calculateDuration = () => {
    if (!session.endTime) return 'In progress';
    
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);
    const durationMs = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(durationMs / 60000);
    
    return `${minutes} min`;
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 75) return 'text-accent-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-error-500';
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="container-custom py-8">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </button>
        
        <div className="card border border-gray-100 mb-8">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h1 className="heading-2 mb-2 sm:mb-0">Interview Feedback</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{calculateDuration()}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-1" />
                  <span className={`font-semibold text-lg ${getScoreColor(session.totalScore || 0)}`}>
                    {session.totalScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card p-4 border">
                <h3 className="text-lg font-medium mb-3">Strengths</h3>
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
                <h3 className="text-lg font-medium mb-3">Areas to Improve</h3>
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
              <h3 className="text-lg font-medium mb-3">Overall Feedback</h3>
              <p className="text-gray-700">{session.summary?.overallFeedback}</p>
            </div>
          </div>
        </div>
        
        <div className="card border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="heading-3">Question & Answer Analysis</h2>
          </div>
          
          <div className="divide-y">
            {session.questions.map((question, index) => {
              const answer = session.answers[index];
              if (!answer) return null;
              
              return (
                <div key={question.id} className="p-6">
                  <h3 className="font-medium text-lg mb-4">Question {index + 1}</h3>
                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary-700">AI</span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 flex-1">
                        <p className="text-gray-800">{question.text}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-secondary-700">You</span>
                      </div>
                      <div className="bg-secondary-50 rounded-lg p-3 flex-1">
                        <p className="text-gray-800">{answer.text}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-4">
                    <div className="flex items-center mb-3">
                      <h4 className="font-medium">Feedback</h4>
                      <div className="ml-auto">
                        <span className={`font-semibold ${getScoreColor(answer.feedback.score)}`}>
                          Score: {answer.feedback.score}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Strengths</h5>
                        <ul className="list-disc pl-5">
                          {answer.feedback.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-gray-700">{strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-amber-700 mb-2">Areas to Improve</h5>
                        <ul className="list-disc pl-5">
                          {answer.feedback.improvements.map((improvement, i) => (
                            <li key={i} className="text-sm text-gray-700">{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-green-200">
                      <p className="text-sm text-gray-700">{answer.feedback.summary}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
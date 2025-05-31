import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Award, ExternalLink } from 'lucide-react';
import { Interview } from '../../types';

interface RecentInterviewCardProps {
  interview: Interview;
}

const RecentInterviewCard: React.FC<RecentInterviewCardProps> = ({ interview }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(interview.session.startTime).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 70) return 'text-accent-500';
    return 'text-error-500';
  };

  const calculateDuration = () => {
    if (!interview.session.endTime) return 'In progress';
    
    const startTime = new Date(interview.session.startTime);
    const endTime = new Date(interview.session.endTime);
    const durationMs = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(durationMs / 60000);
    
    return `${minutes} min`;
  };

  return (
    <div className="card border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{interview.domain}</h3>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{calculateDuration()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Award className="h-5 w-5 mr-1" />
            <span className={`font-semibold text-lg ${getScoreColor(interview.score)}`}>
              {interview.score}%
            </span>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
              <span className="text-xs font-medium text-primary-700">AI</span>
            </div>
            <div className="flex-1">
              <div className="inline-block bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800">
                {interview.session.questions[0]?.text.substring(0, 100)}...
              </div>
            </div>
          </div>
          {interview.session.answers[0] && (
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 flex-shrink-0 rounded-full bg-secondary-100 flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-secondary-700">You</span>
              </div>
              <div className="flex-1">
                <div className="inline-block bg-secondary-50 rounded-lg px-3 py-2 text-sm text-gray-800">
                  {interview.session.answers[0].text.substring(0, 100)}...
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={() => navigate(`/feedback/${interview.session.id}`)}
          className="btn btn-outline w-full flex items-center justify-center"
        >
          View Details <ExternalLink className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default RecentInterviewCard;
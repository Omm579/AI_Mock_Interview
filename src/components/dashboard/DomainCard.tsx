import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { InterviewDomain } from '../../types';
import { cn } from '../../utils/cn';
import * as Icons from 'lucide-react';

interface DomainCardProps {
  domain: InterviewDomain;
}

const DomainCard: React.FC<DomainCardProps> = ({ domain }) => {
  const navigate = useNavigate();
  
  // Dynamically get icon from lucide-react
  const IconComponent = (Icons as any)[domain.icon] || Icons.Briefcase;

  const handleStartInterview = () => {
    navigate(`/interview?domain=${domain.id}`);
  };

  return (
    <div className="card transition-all duration-300 hover:shadow-lg border border-gray-100 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "h-12 w-12 rounded-md flex items-center justify-center",
            "bg-primary-100 text-primary-600"
          )}>
            <IconComponent className="h-6 w-6" />
          </div>
          <button
            onClick={handleStartInterview}
            className="text-primary-500 hover:text-primary-600 transition-transform transform group-hover:translate-x-1"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <h3 className="heading-3 mb-2">{domain.name}</h3>
        <p className="text-gray-600 mb-4">{domain.description}</p>
        <div className="mt-auto">
          <div className="mb-2">
            <span className="text-sm text-gray-700 font-medium">Difficulty levels:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {domain.difficultyLevels.map((level) => (
              <span 
                key={level.id} 
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  level.id === 'beginner' && "bg-green-100 text-green-800",
                  level.id === 'intermediate' && "bg-yellow-100 text-yellow-800",
                  level.id === 'expert' && "bg-red-100 text-red-800"
                )}
              >
                {level.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div 
        className="h-1.5 w-full bg-gradient-to-r from-primary-400 to-primary-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
      />
    </div>
  );
};

export default DomainCard;
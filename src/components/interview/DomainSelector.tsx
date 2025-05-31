import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { InterviewDomain, DifficultyLevel } from '../../types';
import { cn } from '../../utils/cn';

interface DomainSelectorProps {
  domains: InterviewDomain[];
  onSelectDomain: (domainId: string, difficultyId: string) => void;
}

const DomainSelector: React.FC<DomainSelectorProps> = ({ domains, onSelectDomain }) => {
  const [selectedDomain, setSelectedDomain] = useState<InterviewDomain | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  const handleDomainSelect = (domain: InterviewDomain) => {
    setSelectedDomain(domain);
    setSelectedDifficulty(null); // Reset difficulty selection when domain changes
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
  };

  const handleStartInterview = () => {
    if (selectedDomain && selectedDifficulty) {
      onSelectDomain(selectedDomain.id, selectedDifficulty.id);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="heading-2 mb-6 text-center">Choose Your Interview Domain</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {domains.map((domain) => {
          // Dynamically get icon from lucide-react
          const IconComponent = (Icons as any)[domain.icon] || Icons.Briefcase;
          
          return (
            <div
              key={domain.id}
              className={cn(
                "card p-6 cursor-pointer transition-all duration-200 hover:shadow-md border",
                selectedDomain?.id === domain.id
                  ? "border-primary-500 ring-2 ring-primary-200"
                  : "border-gray-100 hover:border-gray-200"
              )}
              onClick={() => handleDomainSelect(domain)}
            >
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">{domain.name}</h3>
              </div>
              <p className="text-gray-600 text-sm">{domain.description}</p>
            </div>
          );
        })}
      </div>
      
      {selectedDomain && (
        <div className="mt-8 animate-fade-in">
          <h3 className="heading-3 mb-4">Select Difficulty Level</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {selectedDomain.difficultyLevels.map((difficulty) => (
              <div
                key={difficulty.id}
                className={cn(
                  "card p-4 cursor-pointer transition-all duration-200 hover:shadow-md border",
                  selectedDifficulty?.id === difficulty.id
                    ? "border-primary-500 ring-2 ring-primary-200"
                    : "border-gray-100 hover:border-gray-200",
                  difficulty.id === 'beginner' && "hover:border-green-200",
                  difficulty.id === 'intermediate' && "hover:border-yellow-200",
                  difficulty.id === 'expert' && "hover:border-red-200"
                )}
                onClick={() => handleDifficultySelect(difficulty)}
              >
                <h4 className={cn(
                  "font-semibold mb-1",
                  difficulty.id === 'beginner' && "text-green-700",
                  difficulty.id === 'intermediate' && "text-yellow-700",
                  difficulty.id === 'expert' && "text-red-700"
                )}>
                  {difficulty.name}
                </h4>
                <p className="text-gray-600 text-sm">{difficulty.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <button
              className="btn btn-primary px-8 py-3 flex items-center"
              disabled={!selectedDifficulty}
              onClick={handleStartInterview}
            >
              Start Interview
              <Icons.ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainSelector;
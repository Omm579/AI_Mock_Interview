import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, History, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import DomainCard from '../components/dashboard/DomainCard';
import RecentInterviewCard from '../components/dashboard/RecentInterviewCard';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import { mockInterviews } from '../data/mockData';

const DashboardPage: React.FC = () => {
  const { user, domains } = useAppContext();
  
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="heading-1 mb-2">Welcome back, {user?.name}</h1>
            <p className="text-gray-600">Ready to improve your interview skills today?</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/interview" className="btn btn-primary flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Interview
            </Link>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="heading-2">Practice Domains</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {domains.slice(0, 4).map((domain) => (
                  <DomainCard key={domain.id} domain={domain} />
                ))}
              </div>
              {domains.length > 4 && (
                <div className="mt-4 text-center">
                  <Link to="/domains" className="text-primary-500 hover:text-primary-600 font-medium">
                    View all domains
                  </Link>
                </div>
              )}
            </div>
            
            {mockInterviews.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="heading-2">Recent Interviews</h2>
                  <Link to="/history" className="text-primary-500 hover:text-primary-600 font-medium flex items-center">
                    <History className="mr-1 h-4 w-4" />
                    View all
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {mockInterviews.map((interview) => (
                    <RecentInterviewCard key={interview.id} interview={interview} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            <div className="card p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user?.name}</h3>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Interviews</span>
                  <span className="font-medium">{mockInterviews.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-medium">
                    {mockInterviews.length > 0 
                      ? `${Math.round(mockInterviews.reduce((sum, interview) => sum + interview.score, 0) / mockInterviews.length)}%`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            {mockInterviews.length > 0 && (
              <PerformanceChart interviews={mockInterviews} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
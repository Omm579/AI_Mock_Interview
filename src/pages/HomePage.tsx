import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Briefcase, ArrowRight, CheckCircle, BarChart2, Mic } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="section relative overflow-hidden">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Master Your Interview Skills with <span className="text-primary-500">AI-Powered</span> Practice
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Prepare for your next job interview with our intelligent mock interview platform. Get real-time feedback, improve your answers, and boost your confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="btn btn-primary px-6 py-3">
                  {isAuthenticated ? "Start Practicing" : "Sign up Free"} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to={isAuthenticated ? "/dashboard" : "/login"} className="btn btn-outline px-6 py-3">
                  {isAuthenticated ? "View Dashboard" : "Log in"}
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-80 md:h-96 bg-gradient-to-tr from-primary-100 to-secondary-100 rounded-xl shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-start mb-4">
                      <div className="mr-3 mt-1 flex-shrink-0">
                        <Brain className="h-6 w-6 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">Tell me about your experience with React hooks.</p>
                      </div>
                    </div>
                    <div className="ml-9 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                      I've been using React hooks for the past two years in production applications. They've simplified my code by replacing class components with functional components that can use state and other React features.
                    </div>
                    <div className="mt-4 ml-9 p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                      <p className="text-sm font-medium text-green-800">Good answer! You mentioned practical experience.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-2 mb-4">How InterviewAI Works</h2>
            <p className="text-gray-600">
              Our platform uses advanced AI technology to create a realistic interview experience and provide actionable feedback to help you improve.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 border border-gray-100 transition-transform hover:translate-y-[-5px]">
              <div className="bg-primary-100 h-12 w-12 rounded-lg flex items-center justify-center mb-5">
                <Briefcase className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="heading-3 mb-3">Select Your Domain</h3>
              <p className="text-gray-600">
                Choose from a variety of domains and difficulty levels to match your career goals and experience.
              </p>
            </div>
            
            <div className="card p-6 border border-gray-100 transition-transform hover:translate-y-[-5px]">
              <div className="bg-secondary-100 h-12 w-12 rounded-lg flex items-center justify-center mb-5">
                <Mic className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="heading-3 mb-3">Answer Questions</h3>
              <p className="text-gray-600">
                Respond to AI-generated questions using text or voice, just like in a real interview.
              </p>
            </div>
            
            <div className="card p-6 border border-gray-100 transition-transform hover:translate-y-[-5px]">
              <div className="bg-accent-100 h-12 w-12 rounded-lg flex items-center justify-center mb-5">
                <BarChart2 className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="heading-3 mb-3">Get Detailed Feedback</h3>
              <p className="text-gray-600">
                Receive instant analysis of your performance with actionable insights to improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-tr from-secondary-100 to-primary-50 rounded-xl p-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-800">Practice in a stress-free environment at your own pace</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-800">Get personalized feedback to improve specific areas</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-800">Track your progress over time with performance metrics</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-800">Practice for a wide range of domains and positions</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-800">Review and correct your answers to improve over time</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="heading-2 mb-4">Why Practice with InterviewAI?</h2>
              <p className="text-gray-700 mb-6">
                Traditional interview preparation often lacks personalized feedback and real-time assessment. Our platform fills that gap with AI-powered practice sessions that simulate real interviews and provide actionable insights.
              </p>
              <p className="text-gray-700 mb-8">
                Whether you're preparing for your first job interview or looking to level up in your career, InterviewAI helps you build confidence and improve your interview skills.
              </p>
              <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="btn btn-primary">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-6">Ready to Ace Your Next Interview?</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who've improved their interview skills and landed their dream jobs with InterviewAI.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3">
            Start Free Practice
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { Question, Answer, Feedback } from '../../types';
import { mockAIService } from '../../services/mockAIService';
import { cn } from '../../utils/cn';

interface InterviewSessionProps {
  domainId: string;
  difficultyId: string;
  onComplete: (questions: Question[], answers: Answer[]) => void;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({
  domainId,
  difficultyId,
  onComplete,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial question
    const loadQuestion = async () => {
      setIsProcessing(true);
      try {
        const initialQuestion = await mockAIService.generateNextQuestion(domainId, difficultyId);
        setQuestions([initialQuestion]);
      } catch (error) {
        console.error('Failed to load initial question:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    loadQuestion();

    // Check if speech recognition is supported
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setRecognitionSupported(true);
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [domainId, difficultyId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [questions, answers, feedback]);

  const handleSendAnswer = async () => {
    if (!currentAnswer.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const currentQuestion = questions[currentQuestionIndex];
      
      // Generate feedback for the answer
      const newFeedback = await mockAIService.generateFeedback(currentQuestion, currentAnswer);
      setFeedback(newFeedback);
      
      // Store the answer with its feedback
      const newAnswer: Answer = {
        id: `answer-${Date.now()}`,
        questionId: currentQuestion.id,
        text: currentAnswer,
        feedback: newFeedback,
        timestamp: new Date().toISOString(),
      };
      
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);
      setCurrentAnswer('');
      
      // Check if we need to load the next question or complete the interview
      if (updatedAnswers.length >= 3) {
        // Complete interview after 3 questions for this demo
        setIsComplete(true);
        onComplete(questions, updatedAnswers);
      } else {
        // Load next question
        setTimeout(async () => {
          const nextQuestion = await mockAIService.generateNextQuestion(
            domainId,
            difficultyId,
            questions
          );
          setQuestions([...questions, nextQuestion]);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setFeedback(null);
        }, 1500); // Delay to allow user to read feedback
      }
    } catch (error) {
      console.error('Error processing answer:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (!recognitionSupported) return;
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setCurrentAnswer(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendAnswer();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="p-4 border-b bg-gradient-to-r from-primary-500 to-primary-600">
        <h3 className="text-lg font-medium text-center text-white">Interview in Progress</h3>
      </div>
      
      <div className="h-[600px] overflow-y-auto p-4 bg-gray-50">
        <div className="flex flex-col space-y-6">
          {questions.slice(0, currentQuestionIndex + 1).map((question, index) => (
            <div key={question.id} className="space-y-4">
              {/* AI Question */}
              <div className="flex items-start animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-sm font-medium text-white">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-md">
                    <p className="text-gray-800 leading-relaxed">{question.text}</p>
                  </div>
                </div>
              </div>
              
              {/* User Answer */}
              {answers[index] && (
                <div className="flex items-start flex-row-reverse animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center ml-3 shadow-lg">
                    <span className="text-sm font-medium text-white">You</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl rounded-tr-none p-4 shadow-md">
                      <p className="text-gray-800 leading-relaxed">{answers[index].text}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Enhanced Feedback Section */}
              {answers[index]?.feedback && (
                <div className="mx-12 animate-fade-in">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b border-green-100">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-800">Feedback Analysis</h4>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-600 mr-2">Score:</span>
                          <span className={`text-lg font-bold ${getScoreColor(answers[index].feedback.score)}`}>
                            {answers[index].feedback.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      {/* Strengths */}
                      <div>
                        <h5 className="text-sm font-semibold text-green-700 mb-2">Strengths</h5>
                        <ul className="space-y-2">
                          {answers[index].feedback.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-700">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Areas to Improve */}
                      <div>
                        <h5 className="text-sm font-semibold text-amber-700 mb-2">Areas to Improve</h5>
                        <ul className="space-y-2">
                          {answers[index].feedback.improvements.map((improvement, i) => (
                            <li key={i} className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-700">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Summary */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-700 italic">
                          "{answers[index].feedback.summary}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Section */}
      {!isComplete && (
        <div className="p-4 border-t bg-white">
          <div className="flex items-center">
            <button
              onClick={toggleRecording}
              className={cn(
                "p-3 rounded-full mr-3",
                isRecording 
                  ? "bg-red-100 text-red-600 hover:bg-red-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                !recognitionSupported && "opacity-50 cursor-not-allowed"
              )}
              disabled={!recognitionSupported || isProcessing}
              title={recognitionSupported ? "Toggle voice input" : "Speech recognition not supported"}
            >
              {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                className="w-full p-4 pr-12 border rounded-xl resize-none h-24 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                disabled={isProcessing}
              />
              <button
                onClick={handleSendAnswer}
                className={cn(
                  "absolute right-3 bottom-3 p-3 rounded-lg transition-all duration-200",
                  currentAnswer.trim() && !isProcessing
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
                disabled={!currentAnswer.trim() || isProcessing}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {isRecording && (
            <div className="text-center mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-600">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2" />
                Recording... Click the microphone to stop
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
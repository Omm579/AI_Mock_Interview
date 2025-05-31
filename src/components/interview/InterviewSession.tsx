import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, RefreshCcw } from 'lucide-react';
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

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-center">Interview in Progress</h3>
      </div>
      
      <div className="h-[500px] overflow-y-auto p-4 flex flex-col space-y-4">
        {questions.slice(0, currentQuestionIndex + 1).map((question, index) => (
          <React.Fragment key={question.id}>
            {/* AI Question */}
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-xs font-medium text-primary-700">AI</span>
              </div>
              <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-[85%]">
                <p className="text-gray-800">{question.text}</p>
              </div>
            </div>
            
            {/* User Answer */}
            {answers[index] && (
              <div className="flex items-start flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center ml-2 flex-shrink-0">
                  <span className="text-xs font-medium text-secondary-700">You</span>
                </div>
                <div className="bg-secondary-50 rounded-lg rounded-tr-none p-3 max-w-[85%]">
                  <p className="text-gray-800">{answers[index].text}</p>
                </div>
              </div>
            )}
            
            {/* Feedback */}
            {answers[index] && (
              <div className="ml-10 mr-10">
                <div className="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-3">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-semibold text-green-700">Score: </span>
                    <span className="ml-2 text-sm font-bold text-green-800">{answers[index].feedback.score}%</span>
                  </div>
                  
                  {answers[index].feedback.strengths.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-green-700">Strengths:</span>
                      <ul className="list-disc pl-5 mt-1">
                        {answers[index].feedback.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-gray-700">{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {answers[index].feedback.improvements.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-amber-700">Areas to improve:</span>
                      <ul className="list-disc pl-5 mt-1">
                        {answers[index].feedback.improvements.map((improvement, i) => (
                          <li key={i} className="text-sm text-gray-700">{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-700 mt-2">{answers[index].feedback.summary}</p>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        
        {isProcessing && currentQuestionIndex === questions.length - 1 && !feedback && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
            <span className="ml-2 text-sm text-gray-500">Analyzing your response...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {!isComplete && (
        <div className="p-4 border-t">
          <div className="flex items-center">
            <button
              onClick={toggleRecording}
              className={cn(
                "p-2 rounded-full mr-2", 
                isRecording 
                  ? "bg-red-100 text-red-600 hover:bg-red-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                !recognitionSupported && "opacity-50 cursor-not-allowed"
              )}
              disabled={!recognitionSupported || isProcessing}
              title={recognitionSupported ? "Toggle voice input" : "Speech recognition not supported in your browser"}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <div className="flex-1 relative">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                className="w-full p-3 pr-12 border rounded-lg resize-none h-20 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={isProcessing}
              />
              <button
                onClick={handleSendAnswer}
                className="absolute right-2 bottom-2 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!currentAnswer.trim() || isProcessing}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
          {isRecording && (
            <div className="text-xs text-center mt-2 text-red-600 animate-pulse">
              Recording... Click the microphone icon again to stop
            </div>
          )}
          {!recognitionSupported && (
            <div className="text-xs text-center mt-2 text-gray-500">
              Voice input is not supported in your browser. Please type your answers.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
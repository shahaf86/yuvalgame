import React, { useState } from 'react';
import GameLayout from './GameLayout';
import { stories } from '../data/stories';
import confetti from 'canvas-confetti';
import { Check, X } from 'lucide-react';

const HebrewGame = ({ score, updateScore, onBack }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
    const [selectedOption, setSelectedOption] = useState(null);

    // Use modulo to loop infinitely roughly, or reshuffle. 
    const story = stories[currentStoryIndex % stories.length];
    const currentQuestion = story.questions[currentQuestionIndex];

    const handleOptionClick = (index) => {
        if (feedback === 'correct') return; // block if already success

        setSelectedOption(index);
        if (index === currentQuestion.correctAnswer) {
            setFeedback('correct');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4ECDC4', '#2ECC71', '#F9D423']
            });
            updateScore(10);

            setTimeout(() => {
                setFeedback(null);
                setSelectedOption(null);

                // Check if there are more questions in this story
                if (currentQuestionIndex < story.questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    // Move to next story and reset question index
                    setCurrentQuestionIndex(0);
                    setCurrentStoryIndex(prev => prev + 1);
                }
            }, 2000);
        } else {
            setFeedback('wrong');
            setTimeout(() => {
                setFeedback(null);
            }, 1000);
        }
    };

    return (
        <GameLayout title="משימת קריאה" score={score} onBack={onBack}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 animate-bounce-in">

                {/* Story Card */}
                <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 border-r-8 border-secondary overflow-y-auto max-h-[80vh]">
                    <h2 className="text-3xl font-bold text-secondary mb-4">{story.title}</h2>
                    <p className="text-xl sm:text-2xl leading-relaxed text-gray-700 font-medium whitespace-pre-line">
                        {story.text}
                    </p>
                </div>

                {/* Question Card */}
                <div className="flex flex-col gap-4 justify-center">
                    <div className="bg-white rounded-2xl shadow-md p-6 border-b-4 border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-gray-800">שאלה {currentQuestionIndex + 1} מתוך {story.questions.length}</h3>
                        </div>
                        <p className="text-xl text-primary font-bold">{currentQuestion.question}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {currentQuestion.options.map((option, idx) => {
                            // Determine button state color
                            let btnClass = "bg-white border-2 border-gray-200 hover:border-secondary hover:bg-teal-50"; // default
                            if (selectedOption === idx) {
                                if (feedback === 'correct') btnClass = "bg-green-100 border-green-500 text-green-800";
                                if (feedback === 'wrong') btnClass = "bg-red-100 border-red-500 text-red-800";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionClick(idx)}
                                    className={`
                    w-full text-right p-4 rounded-xl text-lg font-medium transition-all duration-200 transform hover:-translate-x-1 shadow-sm
                    ${btnClass}
                  `}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{option}</span>
                                        {selectedOption === idx && feedback === 'correct' && <Check className="w-5 h-5 text-green-600" />}
                                        {selectedOption === idx && feedback === 'wrong' && <X className="w-5 h-5 text-red-600" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </GameLayout>
    );
};

export default HebrewGame;

import React, { useState, useEffect, useRef } from 'react';
import GameLayout from './GameLayout';
import confetti from 'canvas-confetti';
import { Send, RefreshCw } from 'lucide-react';

const generateProblem = () => {
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let num1, num2, answer;

    switch (operator) {
        case '+':
            // Addition up to 100
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            answer = num1 + num2;
            break;
        case '-':
            // Subtraction, result positive, up to 100
            num1 = Math.floor(Math.random() * 100) + 10;
            num2 = Math.floor(Math.random() * num1); // smaller than num1
            answer = num1 - num2;
            break;
        case '*':
            // Mult 1-5 for easier level or simple 1-10 but weighted lower
            num1 = Math.floor(Math.random() * 6) + 1; // 1-6
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 * num2;
            break;
        case '/':
            // Div, whole numbers. Result 1-10.
            answer = Math.floor(Math.random() * 10) + 1; // 1-10
            num2 = Math.floor(Math.random() * 5) + 1; // 1-5 divisor
            num1 = answer * num2; // Dividend
            break;
        default:
            num1 = 1; num2 = 1; answer = 2;
    }

    return { num1, num2, operator, answer };
};

const MathGame = ({ score, updateScore, onBack }) => {
    const [problem, setProblem] = useState(generateProblem);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [problem]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userAnswer) return;

        if (parseInt(userAnswer) === problem.answer) {
            setFeedback('correct');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            updateScore(10);

            setTimeout(() => {
                setFeedback(null);
                setUserAnswer('');
                setProblem(generateProblem());
            }, 1500);
        } else {
            setFeedback('wrong');
            // Shake animation? controlled by specific css class maybe
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const getOperatorSymbol = (op) => {
        switch (op) {
            case '*': return '×';
            case '/': return '÷';
            default: return op;
        }
    };

    return (
        <GameLayout title="משחק החשבון" score={score} onBack={onBack}>
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 text-center border-4 border-indigo-100">

                <div className="bg-indigo-50 rounded-2xl p-8 mb-8">
                    <div className="text-6xl font-bold font-mono text-gray-800 flex justify-center items-center gap-4" dir="ltr">
                        <span>{problem.num1}</span>
                        <span className="text-primary">{getOperatorSymbol(problem.operator)}</span>
                        <span>{problem.num2}</span>
                        <span>=</span>
                        <div className="w-24 h-16 bg-white border-b-4 border-primary rounded-lg flex items-center justify-center text-primary">
                            {userAnswer || "?"}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        ref={inputRef}
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full text-center text-4xl py-4 rounded-full border-4 border-gray-200 focus:border-primary focus:ring-4 focus:ring-orange-200 outline-none transition-all font-bold text-gray-700"
                        placeholder="התשובה שלך..."
                        inputMode="numeric"
                        disabled={feedback === 'correct'}
                    />

                    <button
                        type="submit"
                        disabled={feedback === 'correct'}
                        className={`
              w-full py-4 rounded-full text-2xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-3
              ${feedback === 'correct' ? 'bg-green-500 hover:bg-green-600' :
                                feedback === 'wrong' ? 'bg-red-500 hover:bg-red-600' :
                                    'bg-orange-500 hover:bg-orange-600'}
            `}
                    >
                        {feedback === 'correct' ? 'כל הכבוד!' :
                            feedback === 'wrong' ? 'נסה שוב' :
                                <>
                                    <span>בדוק תשובה</span>
                                    <Send className="w-6 h-6 rotate-180" />
                                </>}
                    </button>
                </form>

            </div>
        </GameLayout>
    );
};

export default MathGame;

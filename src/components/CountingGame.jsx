import React, { useState, useEffect } from 'react';
import GameLayout from './GameLayout';
import confetti from 'canvas-confetti';
import { RefreshCw } from 'lucide-react';

const EMOJIS = ['🍎', '🐶', '⭐', '🚗', '🎈', '🍪', '🐱', '⚽'];

const CountingGame = ({ score, updateScore, onBack }) => {
    const [count, setCount] = useState(0);
    const [targetEmoji, setTargetEmoji] = useState('');
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        generateLevel();
    }, []);

    const generateLevel = () => {
        // 1. Random count 1-10
        const newCount = Math.floor(Math.random() * 10) + 1;
        // 2. Random emoji
        const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

        // 3. Generate options (one correct, two random wrong)
        let opts = [newCount];
        while (opts.length < 3) {
            const r = Math.floor(Math.random() * 10) + 1;
            if (!opts.includes(r)) opts.push(r);
        }
        // Shuffle options
        opts.sort(() => Math.random() - 0.5);

        setCount(newCount);
        setTargetEmoji(emoji);
        setOptions(opts);
        setFeedback(null);
    };

    const handleOptionClick = (val) => {
        if (feedback) return;

        if (val === count) {
            setFeedback('correct');
            updateScore(5);
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FF69B4', '#FFD700', '#00BFFF']
            });
            // Play sound? (Optional)
            setTimeout(() => {
                generateLevel();
            }, 2000);
        } else {
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    return (
        <GameLayout title="כַּמָּה יֵשׁ?" score={score} onBack={onBack}>
            <div className="flex flex-col items-center gap-8 w-full max-w-2xl">

                {/* Display Area */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-200 min-h-[300px] flex items-center justify-center w-full">
                    <div className="flex flex-wrap gap-4 justify-center animate-bounce-in">
                        {Array.from({ length: count }).map((_, i) => (
                            <span key={i} className="text-6xl sm:text-7xl drop-shadow-md select-none transform hover:scale-110 transition-transform cursor-pointer">
                                {targetEmoji}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Options */}
                <div className="flex gap-6 justify-center w-full">
                    {options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(opt)}
                            className={`
                        w-24 h-24 sm:w-28 sm:h-28 rounded-full text-5xl font-bold shadow-lg transition-all transform hover:scale-110 active:scale-95 border-b-8
                        ${feedback === 'correct' && opt === count ? 'bg-green-400 border-green-600 text-white' :
                                    feedback === 'wrong' && opt !== count ? 'bg-gray-200 border-gray-300 text-gray-400' :
                                        'bg-yellow-300 border-yellow-500 text-yellow-800 hover:bg-yellow-200'}
                    `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

            </div>
        </GameLayout>
    );
};

export default CountingGame;

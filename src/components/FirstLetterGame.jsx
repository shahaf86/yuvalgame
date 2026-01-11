import React, { useState, useEffect } from 'react';
import GameLayout from './GameLayout';
import { preschoolData } from '../data/preschoolData';
import { checkApiKey, generateFirstLetterItem } from '../services/gemini';
import confetti from 'canvas-confetti';
import { Volume2 } from 'lucide-react';

const FirstLetterGame = ({ score, updateScore, onBack }) => {
    const [currentItem, setCurrentItem] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const [loading, setLoading] = useState(false);
    const [isAiContent, setIsAiContent] = useState(false);

    useEffect(() => {
        nextLevel();
    }, []);

    const nextLevel = async () => {
        setFeedback(null);
        setCurrentItem(null);

        setLoading(true);
        try {
            if (checkApiKey()) {
                const generated = await generateFirstLetterItem();
                setCurrentItem(generated);
                setIsAiContent(true);
            } else {
                // Fallback
                const random = preschoolData[Math.floor(Math.random() * preschoolData.length)];
                setCurrentItem(random);
                setIsAiContent(false);
            }
        } catch (err) {
            console.error(err);
            const random = preschoolData[Math.floor(Math.random() * preschoolData.length)];
            setCurrentItem(random);
            setIsAiContent(false);
        } finally {
            setLoading(false);
        }
    };

    const speakWord = () => {
        if (!currentItem) return;

        // Cancel previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(currentItem.word);
        utterance.lang = 'he-IL';
        utterance.rate = 0.9; // Slightly slower for kids

        // Voice Selection Logic
        const voices = window.speechSynthesis.getVoices();

        // 1. Try to find a specific Google Hebrew voice (often best quality)
        let bestVoice = voices.find(v => v.name.includes("Google") && v.lang.includes("he"));

        // 2. Fallback to any Hebrew voice
        if (!bestVoice) {
            bestVoice = voices.find(v => v.lang.includes("he"));
        }

        if (bestVoice) {
            utterance.voice = bestVoice;
        }

        window.speechSynthesis.speak(utterance);
    };

    // Ensure voices are loaded (Chrome quirk)
    useEffect(() => {
        const handleVoicesChanged = () => {
            // Just trigger a re-render or ensure voices are available
            window.speechSynthesis.getVoices();
            // We don't really need to store them in state unless we list them, 
            // but reading them ensures the browser loads them.
        };

        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        handleVoicesChanged(); // Call immediately in case they are already loaded

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
            window.speechSynthesis.cancel(); // Cleanup speech on unmount
        };
    }, []);

    const handleOptionClick = (letter) => {
        if (feedback) return;

        if (letter === currentItem.letter) {
            setFeedback('correct');
            updateScore(5);
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
            // Speak the word on success too!
            speakWord();

            setTimeout(() => {
                nextLevel();
            }, 2000);
        } else {
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    if (loading) {
        return (
            <GameLayout title="אוֹת פּוֹתַחַת" score={score} onBack={onBack}>
                <div className="flex flex-col items-center justify-center h-64 animate-bounce">
                    <div className="text-4xl">🤖</div>
                    <p className="text-xl mt-4 font-bold text-gray-500">הרובוט בוחר מילה...</p>
                </div>
            </GameLayout>
        );
    }

    if (!currentItem) return null;

    return (
        <GameLayout title="אוֹת פּוֹתַחַת" score={score} onBack={onBack}>
            <div className="flex flex-col items-center gap-8 w-full max-w-xl animate-bounce-in">

                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-200 text-center w-full relative">

                    <button
                        onClick={speakWord}
                        className="absolute top-4 right-4 bg-purple-100 hover:bg-purple-200 p-3 rounded-full text-purple-600 transition-colors"
                        title="שמע את המילה"
                    >
                        <Volume2 className="w-8 h-8" />
                    </button>

                    <div className="text-9xl mb-6 filter drop-shadow-md">
                        {currentItem.image}
                    </div>

                    <h2 className="text-6xl font-bold text-gray-800 tracking-wide mb-2">
                        {currentItem.word}
                    </h2>
                    {isAiContent && (
                        <div className="absolute bottom-4 left-4 bg-purple-100 text-purple-600 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
                            ✨ AI
                        </div>
                    )}
                    <p className="text-xl text-gray-500 font-medium">בְּאֵיזוֹ אוֹת זֶה מַתְחִיל?</p>
                </div>

                {/* Options */}
                <div className="flex gap-4 justify-center w-full">
                    {currentItem.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(opt)}
                            className={`
                        w-20 h-20 sm:w-24 sm:h-24 rounded-2xl text-5xl font-bold shadow-md transition-all transform hover:-translate-y-2
                        ${feedback === 'correct' && opt === currentItem.letter ? 'bg-green-400 text-white ring-4 ring-green-200' :
                                    feedback === 'wrong' ? 'bg-gray-100 text-gray-300' :
                                        'bg-white text-purple-600 hover:bg-purple-50 ring-4 ring-transparent hover:ring-purple-200'}
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

export default FirstLetterGame;

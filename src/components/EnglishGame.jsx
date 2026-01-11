import React, { useState, useEffect } from 'react';
import GameLayout from './GameLayout';
import { vocab } from '../data/vocab';
import confetti from 'canvas-confetti';
import { RefreshCw } from 'lucide-react';

const EnglishGame = ({ score, updateScore, onBack }) => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]); // indices of currently flipped
    const [matchedPairs, setMatchedPairs] = useState([]); // IDs of matched contents
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        // 1. Select 8 random pairs from vocab (or just use first 8 if few)
        const selectedVocab = vocab.slice(0, 8);

        // 2. Create card objects (2 per vocab item: one Hebrew, one English)
        let deck = [];
        selectedVocab.forEach(item => {
            deck.push({ id: item.id, type: 'he', content: item.he, pairId: item.id });
            deck.push({ id: item.id, type: 'en', content: item.en, pairId: item.id });
        });

        // 3. Shuffle
        deck.sort(() => Math.random() - 0.5);

        setCards(deck);
        setFlippedCards([]);
        setMatchedPairs([]);
    };

    const handleCardClick = (index) => {
        if (isProcessing) return;
        if (flippedCards.includes(index)) return; // Already flipped
        if (matchedPairs.includes(cards[index].pairId)) return; // Already matched

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setIsProcessing(true);
            checkMatch(newFlipped[0], newFlipped[1]);
        }
    };

    const checkMatch = (idx1, idx2) => {
        const card1 = cards[idx1];
        const card2 = cards[idx2];

        if (card1.pairId === card2.pairId) {
            // Match!
            setMatchedPairs(prev => [...prev, card1.pairId]);
            setFlippedCards([]);
            updateScore(5);
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#4ECDC4', '#2ECC71']
            });
            setIsProcessing(false);

            if (matchedPairs.length + 1 === cards.length / 2) {
                // Won entire board
                setTimeout(() => {
                    confetti({ particleCount: 200, spread: 100 });
                }, 500);
            }
        } else {
            // No match
            setTimeout(() => {
                setFlippedCards([]);
                setIsProcessing(false);
            }, 1000);
        }
    };

    return (
        <GameLayout title="מִשְׂחַק הַזִּכָּרוֹן" score={score} onBack={onBack}>
            <div className="flex flex-col items-center gap-6 w-full max-w-2xl">

                <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full">
                    {cards.map((card, index) => {
                        const isFlipped = flippedCards.includes(index) || matchedPairs.includes(card.pairId);
                        const isMatched = matchedPairs.includes(card.pairId);

                        return (
                            <button
                                key={index}
                                onClick={() => handleCardClick(index)}
                                className={`
                  aspect-square rounded-xl text-xl sm:text-2xl font-bold transition-all duration-300 transform
                  ${isFlipped ? 'rotate-y-180 bg-white shadow-lg border-4 border-primary text-gray-800' : 'bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-md border-4 border-white rotate-y-0'}
                  ${isMatched ? 'border-green-400 opacity-50 cursor-default scale-95' : 'hover:scale-105'}
                  flex items-center justify-center p-2 break-all hyphens-auto
                `}
                                disabled={isMatched}
                            >
                                <div className={isFlipped ? "block" : "hidden"}>
                                    {card.content}
                                </div>
                                <div className={!isFlipped ? "block" : "hidden"}>
                                    <span className="text-white/30 text-4xl">?</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {matchedPairs.length === cards.length / 2 && (
                    <div className="animate-bounce-in bg-white p-6 rounded-2xl shadow-xl text-center border-4 border-yellow-400">
                        <h2 className="text-3xl font-bold text-primary mb-2">כָּל הַכָּבוֹד!</h2>
                        <p className="text-gray-600 mb-4">סִיַּמְתָּ אֶת כָּל הַלּוּחַ!</p>
                        <button
                            onClick={initializeGame}
                            className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-teal-500 transition-colors mx-auto"
                        >
                            <RefreshCw className="w-5 h-5" />
                            שַׂחֵק שׁוּב
                        </button>
                    </div>
                )}

            </div>
        </GameLayout>
    );
};

export default EnglishGame;

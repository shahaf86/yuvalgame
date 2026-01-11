import React, { useState, useEffect } from 'react';
import GameLayout from './GameLayout';
import { hangmanWords } from '../data/hangmanWords';
import { checkApiKey, generateHangmanWord } from '../services/gemini';
import confetti from 'canvas-confetti';
import { RefreshCw, Heart } from 'lucide-react';

const ALPHABET = "אבגדהוזחטיכלמנסעפצקרשת".split("");
const FINAL_LETTERS = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };

const HangmanGame = ({ score, updateScore, onBack }) => {
    const [wordData, setWordData] = useState(null);
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [mistakes, setMistakes] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, won, lost
    const [showHint, setShowHint] = useState(false);

    const MAX_MISTAKES = 6;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = async () => {
        setGuessedLetters(new Set());
        setMistakes(0);
        setGameState('playing');
        setShowHint(false);
        setWordData(null); // Clear previous

        setLoading(true);
        try {
            if (checkApiKey()) {
                const generated = await generateHangmanWord();
                setWordData(generated);
            } else {
                // Fallback
                const random = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
                setWordData(random);
            }
        } catch (err) {
            console.error(err);
            const random = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
            setWordData(random);
        } finally {
            setLoading(false);
        }
    };

    const normalizeLetter = (char) => {
        // Determine if we need to check final form mapping validation
        // But for simplicity, we just use base letters in keyboard.
        // The word data has specific letters. 
        return char;
    };

    const handleGuess = (letter) => {
        if (gameState !== 'playing' || guessedLetters.has(letter)) return;

        const newGuessed = new Set(guessedLetters);
        newGuessed.add(letter);
        setGuessedLetters(newGuessed);

        // Check if letter exists in word 
        // We need to handle basic matching. 
        // The word might contain nikud. We should probably strip nikud for checking? 
        // OR we just match the base letter. 
        // For this simple ver, let's assume word string contains base letters or we check existence.

        // Complex Hebrew matching logic:
        // A simple approach: Check if the guessed letter appears in the word string.
        // NOTE: The `hangmanWords` I created have Nikud. 
        // We should probably strip Nikud for the logic check.

        const wordBase = wordData.word.normalize("NFD").replace(/[\u0591-\u05C7]/g, ""); // Strip Nikud

        // Handle final letters logic if needed:
        // If user presses 'כ', it should match 'כ' and 'ך'.
        let match = false;

        // Check main letter
        if (wordBase.includes(letter)) match = true;

        // Check mappings (if user clicked regular, check final in word, and vice versa)
        // Actually, keyboard usally has only standard letters, final letters handled automatically?
        // Let's assume keyboard has standard 22 letters.
        // If word has 'ך' (final caf), matching 'כ' should work? 
        // Let's implement generous matching.

        const lettersInWord = wordBase.split('');
        const isPresent = lettersInWord.some(char => {
            if (char === letter) return true;
            // Check map:
            if (FINAL_LETTERS[char] === letter) return true; // Word has 'ך', user guessed 'כ'
            if (Object.keys(FINAL_LETTERS).find(key => FINAL_LETTERS[key] === letter && key === char)) return true;
            return false;
        });

        if (isPresent) {
            // Correct guess
            // Check win condition
            const allGuessed = wordBase.split('').every(char => {
                // For every char in word, is it covered by a guessed letter?
                // Need reverse map logical check again
                if (newGuessed.has(char)) return true;
                // Check if base version is guessed
                if (FINAL_LETTERS[char] && newGuessed.has(FINAL_LETTERS[char])) return true;
                return false;
            });

            if (allGuessed) {
                setGameState('won');
                updateScore(15);
                confetti({ particleCount: 150, spread: 80 });
            }
        } else {
            // Wrong guess
            const newMistakes = mistakes + 1;
            setMistakes(newMistakes);
            if (newMistakes >= MAX_MISTAKES) {
                setGameState('lost');
            }
        }
    };

    // Strip Nikud helper for display logic
    const getDisplayWord = () => {
        if (!wordData) return [];
        // We want to preserve Nikud for display! but hide based on base letter.
        // This is tricky. simpler: Split by characters (graphemes) is hard in JS with nikud.
        // Easiest: Just use the stripped base word for slots? 
        // User asked for "Kid friendly", so keeping Nikud is nice but implementation is hard without special libraries.
        // FALLBACK: Use stripped word for game logic and display.

        // Let's try to map the nikud-word chars to base chars.
        // Simplified: Just use base letters for now to ensure stability.
        const wordBase = wordData.word.normalize("NFD").replace(/[\u0591-\u05C7]/g, "");
        return wordBase.split('').map(char => {
            let revealed = false;
            if (guessedLetters.has(char)) revealed = true;
            if (FINAL_LETTERS[char] && guessedLetters.has(FINAL_LETTERS[char])) revealed = true;

            if (gameState === 'lost') revealed = true; // Reveal all on loss

            return revealed ? char : '_';
        });
    };

    return (
        <GameLayout title="נַחֵשׁ אֶת הַמִּלָּה" score={score} onBack={onBack}>
            <div className="flex flex-col items-center gap-6 w-full max-w-2xl">

                {loading && (
                    <div className="flex flex-col items-center justify-center h-64 animate-bounce">
                        <div className="text-4xl">🤖</div>
                        <p className="text-xl mt-4 font-bold text-gray-500">הרובוט מחפש מילה...</p>
                    </div>
                )}

                {!loading && wordData && (
                    <>
                        <div className="flex flex-col items-center gap-2 relative">
                            <div className="bg-yellow-100 px-6 py-2 rounded-full font-bold text-yellow-700 shadow-inner flex items-center gap-3">
                                <span>קָטֵגוֹרְיָה: {wordData.category}</span>
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="bg-white/50 hover:bg-white p-1 rounded-full px-3 text-xs border border-yellow-300 transition-all"
                                >
                                    {showHint ? 'הסתר רמז' : 'רמז?'}
                                </button>
                            </div>

                            {showHint && (
                                <div className="absolute top-12 z-20 text-8xl filter drop-shadow-xl animate-bounce-in bg-white/80 p-4 rounded-3xl backdrop-blur-sm border-2 border-yellow-200">
                                    {wordData.image}
                                </div>
                            )}
                        </div>
                )}

                        {/* Visual / Flower */}
                        <div className="relative w-48 h-48 flex justify-center items-center">
                            {/* Simple visual representation of mistakes */}
                            {/* Center (Smile) */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-lg z-10 transition-all
                 ${gameState === 'lost' ? 'bg-gray-300' : 'bg-yellow-300'}
             `}>
                                {gameState === 'lost' ? '😢' : gameState === 'won' ? '😎' : '🙂'}
                            </div>

                            {/* Petals - render based on Remaining lives (MAX - mistakes) */}
                            {[...Array(MAX_MISTAKES)].map((_, i) => {
                                const angle = (i * (360 / MAX_MISTAKES));
                                const isLost = i < mistakes; // If i=0 (1st mistake), 1st petal is lost/grey
                                // Actually standard hangman: Start with 0 parts, add parts on mistake.
                                // "Flower losing petals": Start with ALL, remove one on mistake.
                                const isRemaining = i >= mistakes; // i=0...5. If mistakes=1, i=0 is lost. i=1..5 remain.

                                return (
                                    <div
                                        key={i}
                                        className={`absolute w-12 h-12 rounded-full transform origin-center transition-all duration-500
                            ${isRemaining ? 'bg-pink-400 scale-100 shadow-md' : 'bg-transparent scale-0 opacity-0'}
                        `}
                                        style={{
                                            transform: `rotate(${angle}deg) translate(3.5rem) rotate(-${angle}deg)`,
                                            // simplified positioning around circle
                                            top: '50%', left: '50%', marginTop: '-1.5rem', marginLeft: '-1.5rem',
                                            transform: `rotate(${angle}deg) translateY(-3.5rem)`
                                        }}
                                    />
                                );
                            })}
                        </div>

                        <div className="text-gray-500 text-sm font-bold">
                            {MAX_MISTAKES - mistakes} נִסְיוֹנוֹת נוֹתְרוּ
                        </div>

                        {/* Word Display */}
                        <div className="flex flex-wrap gap-2 justify-center my-4" dir="rtl">
                            {getDisplayWord().map((char, idx) => (
                                <div key={idx} className="w-12 h-16 border-b-4 border-gray-400 flex items-center justify-center text-4xl font-bold text-primary">
                                    {char}
                                </div>
                            ))}
                        </div>

                        {/* Keyboard */}
                        <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                            {ALPHABET.map((letter) => {
                                const isGuessed = guessedLetters.has(letter);
                                return (
                                    <button
                                        key={letter}
                                        onClick={() => handleGuess(letter)}
                                        disabled={isGuessed || gameState !== 'playing'}
                                        className={`
                            w-10 h-12 rounded-lg font-bold text-xl shadow transition-all
                            ${isGuessed ? 'bg-gray-200 text-gray-400' : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:-translate-y-1 hover:shadow-md'}
                        `}
                                    >
                                        {letter}
                                    </button>
                                )
                            })}
                        </div>

                        {gameState !== 'playing' && (
                            <div className="animate-bounce-in mt-4 flex flex-col items-center gap-4">
                                <h2 className={`text-3xl font-bold ${gameState === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                                    {gameState === 'won' ? 'כָּל הַכָּבוֹד!' : 'לֹא נוֹרָא, נַסֶּה שׁוּב!'}
                                </h2>
                                <button
                                    onClick={initGame}
                                    className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    משחק חדש
                                </button>
                            </div>
                        )}

                    </>
                )}

            </div>
        </GameLayout >
    );
};

export default HangmanGame;

import React from 'react';
import { Calculator, BookOpen, LogOut, Star } from 'lucide-react';

const MainMenu = ({ onSelectMode, score, userName, onLogout }) => {
    // Normalization helper
    const isAviv = ['aviv', 'אביב'].includes(userName.toLowerCase().trim());

    // If not Aviv, assume Yuval/Older Kid default
    const isBigKid = !isAviv;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4 font-sans" dir="rtl">

            {/* Score Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow border border-yellow-300">
                <span className="text-xl font-bold text-yellow-600">{score}</span>
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>

            {/* Logout Button */}
            <button
                onClick={onLogout}
                className="absolute top-6 right-6 flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-full shadow transition-colors font-bold"
            >
                <LogOut className="w-5 h-5" />
                <span>יציאה</span>
            </button>

            <div className="text-center mb-12 animate-bounce-in">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 drop-shadow-sm">
                    שלום {userName}!
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                    {isAviv ? 'משחקים לקטנטנים' : 'בחר משחק כדי להתחיל'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">

                {/* BIG KIDS MODE (Yuval) */}
                {isBigKid && (
                    <>
                        <button
                            onClick={() => onSelectMode('math')}
                            className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-transparent hover:border-primary flex flex-col items-center gap-6 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="bg-orange-100 p-6 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300 z-10">
                                <Calculator className="w-16 h-16" />
                            </div>
                            <span className="text-3xl font-bold text-gray-800 z-10">חשבון</span>
                            <span className="text-gray-500 z-10 font-medium">חיבור, חיסור וכפל</span>
                        </button>

                        <button
                            onClick={() => onSelectMode('hebrew')}
                            className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-transparent hover:border-secondary flex flex-col items-center gap-6 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="bg-teal-100 p-6 rounded-full group-hover:bg-secondary group-hover:text-white transition-colors duration-300 z-10">
                                <BookOpen className="w-16 h-16" />
                            </div>
                            <span className="text-3xl font-bold text-gray-800 z-10">עברית</span>
                            <span className="text-gray-500 z-10 font-medium">סיפורים ושאלות</span>
                        </button>

                        <button
                            onClick={() => onSelectMode('english')}
                            className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-transparent hover:border-accent flex flex-col items-center gap-6 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="bg-yellow-100 p-6 rounded-full group-hover:bg-accent group-hover:text-white transition-colors duration-300 z-10">
                                <span className="text-5xl font-bold">Aa</span>
                            </div>
                            <span className="text-3xl font-bold text-gray-800 z-10">אנגלית</span>
                            <span className="text-gray-500 z-10 font-medium">משחק הזיכרון</span>
                        </button>

                        <button
                            onClick={() => onSelectMode('hangman')}
                            className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-transparent hover:border-red-400 flex flex-col items-center gap-6 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="bg-red-100 p-6 rounded-full group-hover:bg-red-400 group-hover:text-white transition-colors duration-300 z-10">
                                <span className="text-5xl">🙂</span>
                            </div>
                            <span className="text-3xl font-bold text-gray-800 z-10">נחש את המילה</span>
                            <span className="text-gray-500 z-10 font-medium">כמו איש תלוי</span>
                        </button>
                    </>
                )}

                {/* PRESCHOOL MODE (Aviv) */}
                {isAviv && (
                    <>
                        <button
                            onClick={() => onSelectMode('counting')}
                            className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-transparent hover:border-pink-400 flex flex-col items-center gap-6 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="bg-pink-100 p-6 rounded-full group-hover:bg-pink-400 group-hover:text-white transition-colors duration-300 z-10">
                                <span className="text-5xl">🍎</span>
                            </div>
                            <span className="text-3xl font-bold text-gray-800 z-10">ספירה</span>
                            <span className="text-gray-500 z-10 font-medium">כמה פריטים יש?</span>
                        </button>

                        <button
                            onClick={() => onSelectMode('firstLetter')}
                            className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-transparent hover:border-purple-400 flex flex-col items-center gap-6 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="bg-purple-100 p-6 rounded-full group-hover:bg-purple-400 group-hover:text-white transition-colors duration-300 z-10">
                                <span className="text-5xl">אב</span>
                            </div>
                            <span className="text-3xl font-bold text-gray-800 z-10">אות פותחת</span>
                            <span className="text-gray-500 z-10 font-medium">באיזה אות מתחיל?</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MainMenu;

import React from 'react';
import { Calculator, BookOpen, Star } from 'lucide-react';

const MainMenu = ({ onSelectMode, score, userName }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4 font-sans" dir="rtl">

            <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow border border-yellow-300">
                <span className="text-xl font-bold text-yellow-600">{score}</span>
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>

            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 drop-shadow-sm">
                    שלום {userName}!
                </h1>
                <p className="text-xl text-gray-600 font-medium">בחר משחק כדי להתחיל</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
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
            </div>
        </div>
    );
};

export default MainMenu;

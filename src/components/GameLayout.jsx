import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

const GameLayout = ({ title, score, onBack, children, className = "" }) => {
    return (
        <div className={`min-h-screen bg-blue-50 flex flex-col font-sans ${className}`} dir="rtl">
            {/* Header */}
            <header className="bg-white shadow-md p-4 flex justify-between items-center z-10 sticky top-0">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-bold text-lg"
                >
                    <ArrowRight className="w-6 h-6" />
                    לתפריט
                </button>

                <h1 className="text-2xl font-bold text-primary">{title}</h1>

                <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full shadow-inner border border-yellow-300">
                    <span className="text-xl font-bold text-yellow-600">{score}</span>
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto p-4 max-w-4xl flex flex-col justify-center items-center">
                {children}
            </main>
        </div>
    );
};

export default GameLayout;

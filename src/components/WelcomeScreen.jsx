import React, { useState } from 'react';
import { Star } from 'lucide-react';

const WelcomeScreen = ({ onStart }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onStart(name.trim());
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border-4 border-indigo-100 animate-bounce-in">
                <div className="mb-6 flex justify-center">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <Star className="w-12 h-12 text-yellow-500 fill-yellow-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold text-primary mb-2">שלום!</h1>
                <p className="text-xl text-gray-600 mb-8">איך קוראים לך?</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-center text-2xl py-3 px-4 rounded-xl border-2 border-gray-300 focus:border-primary focus:ring-4 focus:ring-orange-200 outline-none transition-all placeholder-gray-400"
                        placeholder="השם שלי..."
                        autoFocus
                        required
                    />

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full bg-primary hover:bg-orange-600 text-white text-xl font-bold py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                    >
                        התחל לשחק!
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WelcomeScreen;

import React, { useState, useEffect } from 'react';
import { X, Save, Key } from 'lucide-react';
import { checkApiKey, saveApiKey } from '../services/gemini';

const SettingsModal = ({ onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const current = localStorage.getItem('gemini_api_key');
        if (current) setApiKey(current);
    }, []);

    const handleSave = () => {
        if (!apiKey.trim()) return;
        saveApiKey(apiKey.trim());
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-bounce-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Key className="w-6 h-6 text-primary" />
                    הגדרות הורים / מורים
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            מפתח API של Google Gemini
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="הדבק כאן את המפתח..."
                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none dir-ltr"
                            dir="ltr"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            נדרש כדי לייצר תוכן חדש (סיפורים, מילים) באופן אוטומטי.
                        </p>
                    </div>

                    <button
                        onClick={handleSave}
                        className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2
                            ${saved ? 'bg-green-500' : 'bg-primary hover:bg-orange-600'}
                        `}
                    >
                        <Save className="w-5 h-5" />
                        {saved ? 'נשמר!' : 'שמור הגדרות'}
                    </button>

                    <div className="text-center">
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 text-sm underline">
                            קבל מפתח בחינם כאן
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;

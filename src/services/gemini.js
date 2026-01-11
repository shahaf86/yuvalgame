import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
};

export const checkApiKey = () => {
    return !!localStorage.getItem('gemini_api_key');
};

export const saveApiKey = (key) => {
    localStorage.setItem('gemini_api_key', key);
};

// Generic JSON generator helper
const generateJson = async (prompt) => {
    const genAI = getGenAI();
    if (!genAI) throw new Error("No API Key");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const fullPrompt = `${prompt}
    
    IMPORTANT: Return ONLY valid JSON. No Markdown formatting, no code blocks (like \`\`\`json), just the raw JSON string.`;

    try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        // Clean up markdown if present despite instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
};

// --- Generators ---

export const generateHebrewStory = async () => {
    const prompt = `
    Write a short, engaging story in Hebrew for a 2nd grade child.
    The story must be fully vocalized (with Nikud).
    
    Structure the response as a JSON object with this schema:
    {
        "title": "Story Title",
        "text": "The full story text...",
        "questions": [
            {
                "question": "Question 1?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": 0 // Index of correct option (0-3)
            },
             {
                "question": "Question 2?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": 2
            }
        ]
    }
    Include 2 multiple choice questions.
    `;
    return generateJson(prompt);
};

export const generateEnglishDeck = async () => {
    const prompt = `
    Generate 8 pairs of basic Hebrew-English words for a memory game for kids.
    The Hebrew words must have Nikud.
    Words should be simple nouns: Animals, Colors, Family, Objects.
    
    Response schema (JSON array):
    [
        { "id": 1, "he": "כֶּלֶב", "en": "Dog" },
        ...
    ]
    `;
    return generateJson(prompt);
};

export const generateHangmanWord = async () => {
    const prompt = `
    Choose a random simple concept (Animal, Fruit, Object) for a Hangman game.
    Provide the word in Hebrew (with Nikud), its category, and a relevant Emoji.
    
    Response schema (JSON object):
    {
        "word": "תַּפּוּחַ",
        "category": "פֵּרוֹת",
        "image": "🍎"
    }
    `;
    return generateJson(prompt);
};

export const generateFirstLetterItem = async () => {
    const prompt = `
    Choose a simple object for a preschool "First Letter" matching game.
    Provide the word in Hebrew (with Nikud), the starting letter, 2 wrong letters, and an Emoji.
    
    Response schema (JSON object):
    {
        "word": "כֶּלֶב",
        "letter": "כ",
        "options": ["כ", "ל", "מ"], // One correct, two wrong
        "image": "🐶"
    }
    `;
    return generateJson(prompt);
};

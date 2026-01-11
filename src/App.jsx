import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import MathGame from './components/MathGame';
import HebrewGame from './components/HebrewGame';
import EnglishGame from './components/EnglishGame';
import HangmanGame from './components/HangmanGame';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('kidAppName') || null;
  });
  const [currentMode, setCurrentMode] = useState(null); // 'math', 'hebrew', 'english', 'hangman', null
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('kidAppScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('kidAppScore', score.toString());
  }, [score]);

  const handleUpdateScore = (points) => {
    setScore(prev => prev + points);
  };

  const handleSetUser = (name) => {
    setUserName(name);
    localStorage.setItem('kidAppName', name);
  };

  const renderScreen = () => {
    if (!userName) {
      return <WelcomeScreen onStart={handleSetUser} />;
    }

    switch (currentMode) {
      case 'math':
        return <MathGame
          score={score}
          updateScore={handleUpdateScore}
          onBack={() => setCurrentMode(null)}
        />;
      case 'hebrew':
        return <HebrewGame
          score={score}
          updateScore={handleUpdateScore}
          onBack={() => setCurrentMode(null)}
        />;
      case 'english':
        return <EnglishGame
          score={score}
          updateScore={handleUpdateScore}
          onBack={() => setCurrentMode(null)}
        />;
      case 'hangman':
        return <HangmanGame
          score={score}
          updateScore={handleUpdateScore}
          onBack={() => setCurrentMode(null)}
        />;
      default:
        return <MainMenu
          userName={userName}
          score={score}
          onSelectMode={setCurrentMode}
        />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

export default App;

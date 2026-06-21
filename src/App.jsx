import { useState } from 'react';
import { gamerCards } from './cardsData';
import Card from './Card';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState(''); 
  
  // Stretch Feature: Streak Counters
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const currentCard = gamerCards[currentIndex];

  const handleNextCard = () => {
    if (currentIndex < gamerCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetCardState();
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetCardState();
    }
  };

  const resetCardState = () => {
    setIsFlipped(false);
    setUserGuess('');
    setFeedback('');
  };

  const handleCheckGuess = (e) => {
    e.preventDefault();
    
    const cleanGuess = userGuess.trim().toLowerCase();
    const cleanAnswer = currentCard.answer.toLowerCase();

    if (cleanGuess === cleanAnswer) {
      setFeedback('correct');
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > longestStreak) {
        setLongestStreak(newStreak);
      }
    } else {
      setFeedback('wrong');
      setCurrentStreak(0); // Reset current streak on wrong guess
    }
  };

  return (
    <div className="app-layout">
      <h1>🎮 The Ultimate Gamer Board Trivia</h1>
      <p className="description">Test your gaming knowledge! Type your guess before flipping.</p>
      
      {/* Streak Counter Display */}
      <div className="streak-container">
        <p>🔥 Current Streak: {currentStreak}</p>
        <p>🏆 Longest Streak: {longestStreak}</p>
      </div>

      <p className="card-count">Card {currentIndex + 1} of {gamerCards.length}</p>

      <Card 
        card={currentCard} 
        isFlipped={isFlipped} 
        onClick={() => setIsFlipped(!isFlipped)} 
      />

      <form onSubmit={handleCheckGuess} className="guess-form">
        <input 
          type="text" 
          placeholder="Type your guess here..." 
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          className={`guess-input ${feedback}`}
        />
        <button type="submit" className="submit-btn">Submit Guess</button>
      </form>

      {feedback && (
        <p className={`feedback-text ${feedback}`}>
          {feedback === 'correct' ? '✅ Correct! Splendid guess!' : '❌ Incorrect! Try again or click to flip.'}
        </p>
      )}

      <div className="nav-controls">
        <button className="nav-btn" onClick={handlePrevCard} disabled={currentIndex === 0}>
          ⬅️ Back
        </button>
        <button className="nav-btn" onClick={handleNextCard} disabled={currentIndex === gamerCards.length - 1}>
          Next ➡️
        </button>
      </div>
    </div>
  );
}

export default App;
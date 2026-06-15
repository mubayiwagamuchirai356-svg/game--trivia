import { useState } from 'react';
import { gamerCards } from './cardsData';
import Card from './Card';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Requirement: Choose a random card (sequential order does not receive credit!)
  const handleNextCard = () => {
    setIsFlipped(false); // Requirement: Reset back to front side for the new card
    
    let randomIndex = currentIndex;
    // Loop ensures you always get a genuinely *new* card, avoiding repeats
    while (randomIndex === currentIndex) {
      randomIndex = Math.floor(Math.random() * gamerCards.length);
    }
    setCurrentIndex(randomIndex);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="app-layout">
      {/* Required Feature: Title, description, and total card count */}
      <h1>🎮 The Ultimate Gamer Board Trivia</h1>
      <p className="description">Test your gaming knowledge across eras and genres! Click the card to flip it.</p>
      <p className="card-count">Total Cards: {gamerCards.length}</p>

      {/* Required Feature: Single card container */}
      <Card 
        card={gamerCards[currentIndex]} 
        isFlipped={isFlipped} 
        onClick={handleCardClick} 
      />

      {/* Required Feature: Next button for randomization */}
      <button className="next-btn" onClick={handleNextCard}>
        Next Card ➡️
      </button>
    </div>
  );
}

export default App;
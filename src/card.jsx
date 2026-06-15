import React from 'react';

function Card({ card, isFlipped, onClick }) {
  return (
    <div className={`card-container ${card.category.toLowerCase()}`} onClick={onClick}>
      <div className="card-content">
        {isFlipped ? (
          <div className="card-back">
            <p className="side-label">ANSWER</p>
            <h3>{card.answer}</h3>
          </div>
        ) : (
          <div className="card-front">
            <p className="side-label">QUESTION ({card.category})</p>
            <h3>{card.question}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;

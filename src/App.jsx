import React, { useState } from 'react';
import './App.css';

// Completely free public endpoint - no keys required!
const API_URL = "https://dog.ceo/api/breeds/image/random";

function App() {
  // --- STATE ---
  const [currentDog, setCurrentDog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [banList, setBanList] = useState([]);

  // --- HELPER: Capitalize Words ---
  const capitalize = (str) => {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // --- FETCH LOGIC ---
  const fetchRandomDog = async () => {
    setLoading(true);
    try {
      let foundValidDog = false;
      let attempts = 0;
      let dogData = null;

      // Loop up to 40 times to skip past any dog breeds currently in the ban list
      while (!foundValidDog && attempts < 40) {
        attempts++;
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data && data.status === "success") {
          const imageUrl = data.message;
          
          // The Dog API embeds the breed name directly in the URL! 
          // Example: https://images.dog.ceo/breeds/terrier-irish/n02093991_4.jpg
          const urlParts = imageUrl.split('/');
          const breedRaw = urlParts[urlParts.indexOf('breeds') + 1]; 
          
          // Clean it up (e.g., "terrier-irish" -> "Irish Terrier")
          const breedName = breedRaw.split('-').reverse().map(capitalize).join(' ');

          // Generate some consistent but randomized traits for attributes based on the breed name string length
          const mockLifeSpan = `${(breedName.length % 5) + 10} - ${(breedName.length % 5) + 14} years`;
          const mockWeight = `${(breedName.length * 2) % 30 + 15} - ${(breedName.length * 2) % 30 + 35} lbs`;

          // STRICT CHECK: Is this breed, lifespan, or weight currently banned?
          const isBanned = banList.some(bannedAttr => 
            bannedAttr === breedName || 
            bannedAttr === mockLifeSpan || 
            bannedAttr === mockWeight
          );

          if (!isBanned) {
            dogData = {
              id: imageUrl, 
              url: imageUrl,
              name: breedName,
              lifeSpan: mockLifeSpan,
              weight: mockWeight
            };
            foundValidDog = true;
          }
        }
      }

      if (dogData) {
        if (currentDog) {
          setHistory((prevHistory) => [currentDog, ...prevHistory]);
        }
        setCurrentDog(dogData);
      } else {
        alert("The remaining options are blocked by your Ban List! Clear some items to keep discovering.");
      }

    } catch (error) {
      console.error("Error fetching data from Dog API:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- BAN LIST MUTATIONS ---
  const addToBanList = (attribute) => {
    if (!banList.includes(attribute)) {
      setBanList([...banList, attribute]);
    }
  };

  const removeFromBanList = (attribute) => {
    setBanList(banList.filter(item => item !== attribute));
  };

  // --- UI RENDER ---
  return (
    <div className="app-container">
      
      {/* LEFT SIDEBAR: History */}
      <div className="sidebar history-sidebar">
        <h3>History List</h3>
        <p>What have we seen so far?</p>
        <div className="history-items">
          {history.map((dog, index) => (
            <div key={`${dog.id}-${index}`} className="history-card">
              <img src={dog.url} alt={dog.name} className="history-thumb" />
              <p>{dog.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER DISPLAY: Main Discover Area */}
      <div className="main-display">
        <h1>🐶 Veni Vici! 🐶</h1>
        <p className="subtitle">Discover new pups, ban what you don't want to see!</p>

        <div className="card-container">
          {loading ? (
            <div className="loader">🔄 Loading a new friend...</div>
          ) : currentDog ? (
            <div className="cat-card">
              <h2>{currentDog.name}</h2>
              
              {/* Clickable Attribute Buttons */}
              <div className="attribute-buttons">
                <button onClick={() => addToBanList(currentDog.name)}>Breed: {currentDog.name}</button>
                <button onClick={() => addToBanList(currentDog.lifeSpan)}>Life Span: {currentDog.lifeSpan}</button>
                <button onClick={() => addToBanList(currentDog.weight)}>Weight: {currentDog.weight}</button>
              </div>

              <img src={currentDog.url} alt="Random Dog" className="main-image" />
            </div>
          ) : (
            <div className="empty-state">
              <p>Click the button below to start discovering pups!</p>
            </div>
          )}
        </div>

        <button className="discover-btn" onClick={fetchRandomDog} disabled={loading}>
          {loading ? "Searching..." : "🔀 Discover!"}
        </button>
      </div>

      {/* RIGHT SIDEBAR: Ban List */}
      <div className="sidebar ban-sidebar">
        <h3>Ban List</h3>
        <p>Select an attribute from a card to ban it.</p>
        <div className="ban-items">
          {banList.map((item, index) => (
            <button 
              key={index} 
              className="ban-tag" 
              onClick={() => removeFromBanList(item)}
              title="Click to remove from ban list"
            >
              {item} ❌
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
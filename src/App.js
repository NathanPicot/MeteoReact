import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        setError('La géolocalisation n\'est pas supportée par ce navigateur.');
      }
    };

    const success = async (position) => {
      const { latitude, longitude } = position.coords;
      const API_KEY = '7ada24f6c49b3f4638c8db65468fd13f';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

      try {
        const response = await axios.get(url);
        setWeatherData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des données météo.');
        setLoading(false);
      }
    };

    const error = () => {
      setError('Impossible de récupérer la localisation.');
      setLoading(false);
    };

    getUserLocation();
  }, []);

  return (
      <div className="App">
        <header className="App-header">
          {loading && <p>Chargement...</p>}
          {error && <p>{error}</p>}
          {weatherData && (
              <div>
                <h1>Météo actuelle</h1>
                <p>Lieu: {weatherData.name}</p>
                <p>Température: {weatherData.main.temp}°C</p>
                <p>Condition: {weatherData.weather[0].description}</p>
              </div>
          )}
        </header>
      </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
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
      const previsionUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

      try {
        const response = await axios.get(url);
        const forecastResponse = await axios.get(previsionUrl);
        setForecastData(forecastResponse.data);
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

  // Fonction pour grouper les prévisions par jour
  const groupForecastByDay = (forecastList) => {
    const grouped = forecastList.reduce((grouped, forecast) => {
      const date = forecast.dt_txt.split(' ')[0]; // Obtenir seulement la partie "YYYY-MM-DD"
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(forecast);
      return grouped;
    }, {});

    // Retourner un tableau d'objets {date, forecasts}, et retirer le dernier jour avec slice
    const days = Object.entries(grouped)
        .map(([date, forecasts]) => ({ date, forecasts }))
        .slice(0, -1); // Enlever le dernier jour

    return days;
  };

  return (
      <div className="App">
        <header className="App-header">
          {loading && <p className="loading">Chargement...</p>}
          {error && <p className="error">{error}</p>}

          {weatherData && (
              <div className="current-weather">
                <h1>Météo actuelle</h1>
                <p>Lieu: {weatherData.name}</p>
                <p>Température: {weatherData.main.temp}°C</p>
                <p>Condition: {weatherData.weather[0].description}</p>
                <img
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                />
              </div>
          )}

          {forecastData && (
              <div>
                <h2>Prévisions météo</h2>
                {groupForecastByDay(forecastData.list).map((day, index) => (
                    <div key={index} className="daily-forecast">
                      <h3>{day.date}</h3>
                      <div className="carousel">
                        {day.forecasts.map((item, idx) => (
                            <div key={idx} className="forecast-item">
                              <h3>Prévision pour {item.dt_txt}</h3>
                              <p>Température: {item.main.temp}°C</p>
                              <p>Condition: {item.weather[0].description}</p>
                              <img
                                  src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                  alt={item.weather[0].description}
                              />
                            </div>
                        ))}
                      </div>
                    </div>
                ))}
              </div>
          )}
        </header>
      </div>
  );
}

export default App;

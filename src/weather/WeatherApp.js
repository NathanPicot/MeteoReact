// WeatherApp.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCurrent from './WeatherCurrent';
import DailyForecast from './DailyForecast';

function WeatherApp() {
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

    const groupForecastByDay = (forecastList) => {
        const grouped = forecastList.reduce((grouped, forecast) => {
            const date = forecast.dt_txt.split(' ')[0];
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(forecast);
            return grouped;
        }, {});

        const days = Object.entries(grouped)
            .map(([date, forecasts]) => ({ date, forecasts }))
            .slice(0, -1);

        return days;
    };

    return (
        <div className="App">
            <header className="App-header">
                {loading && <p className="loading">Chargement...</p>}
                {error && <p className="error">{error}</p>}

                {weatherData && <WeatherCurrent weatherData={weatherData} />}

                {forecastData && (
                    <div>
                        <h2>Prévisions météo</h2>
                        {groupForecastByDay(forecastData.list).map((day, index) => (
                            <DailyForecast key={index} day={day} />
                        ))}
                    </div>
                )}
            </header>
        </div>
    );
}

export default WeatherApp;

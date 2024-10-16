import React from 'react';

function WeatherCurrent({ weatherData }) {
    return (
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
    );
}

export default WeatherCurrent;

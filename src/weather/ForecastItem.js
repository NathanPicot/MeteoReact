// ForecastItem.js
import React from 'react';

function ForecastItem({ item }) {
    return (
        <div className="forecast-item">
            <h3>Prévision pour {item.dt_txt}</h3>
            <p>Température: {item.main.temp}°C</p>
            <p>Condition: {item.weather[0].description}</p>
            <img
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
            />
        </div>
    );
}

export default ForecastItem;

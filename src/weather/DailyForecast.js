// DailyForecast.js
import React from 'react';
import ForecastItem from './ForecastItem';

function DailyForecast({ day }) {
    return (
        <div className="daily-forecast">
            <h3>{day.date}</h3>
            <div className="carousel">
                {day.forecasts.map((item, idx) => (
                    <ForecastItem key={idx} item={item} />
                ))}
            </div>
        </div>
    );
}

export default DailyForecast;

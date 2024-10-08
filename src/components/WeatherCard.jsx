import React from 'react';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const WeatherCard = ({ date, icon, temperature, humidity, windSpeed, location }) => {
  return (
    <div className="bg-gradient-to-b from-purple-600 to-blue-500 rounded-2xl p-6 shadow-lg text-white w-80">
      {date && <p className="text-xl font-bold text-center mb-4">{date}</p>}
      <div className="flex flex-col items-center mb-4">
        <img src={icon} alt="Weather Icon" className="h-20 w-20 mb-4" />
        <p className="text-5xl font-bold mb-2">{temperature}°C</p>
        {location && <p className="text-2xl">{location}</p>}
      </div>
      <div className="flex justify-between text-base text-gray-200">
        <div className="flex items-center space-x-4">
          <img src={humidity_icon} alt="Humidity" className="h-8 w-8" />
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-lg">{humidity}%</span>
            <p className="text-md text-gray-300">Humidity</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <img src={wind_icon} alt="Wind Speed" className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="text-lg">{windSpeed} km/h</span>
            <p className="text-md text-gray-300">Wind Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

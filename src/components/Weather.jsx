import React, { useEffect, useRef, useState } from 'react';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);

  const allIcons = {
    '01d': clear_icon,
    '01n': clear_icon,
    '02d': cloud_icon,
    '02n': cloud_icon,
    '03d': cloud_icon,
    '03n': cloud_icon,
    '04d': cloud_icon,
    '04n': cloud_icon,
    '09d': drizzle_icon,
    '09n': drizzle_icon,
    '10d': rain_icon,
    '10n': rain_icon,
    '13d': snow_icon,
    '13n': snow_icon,
  };

  const search = async (city) => {
    if (city === '') {
      alert('Enter city name');
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        location: data.name,
        temperature: (data.main.temp - 273.15).toFixed(2),
        icon: icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      });
    } catch (error) {
      setWeatherData(false);
      console.log('Error in fetching weather data');
    }
  };

  useEffect(() => {
    search('New York'); // Initial search when component loads
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-400">
      <div className="bg-gradient-to-b from-purple-600 to-blue-500 rounded-2xl p-8 shadow-lg text-white w-80">
        <div className="flex items-center justify-between mb-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="City Name"
            className="w-full py-2 px-4 rounded-full  text-black focus:outline-none"
          />
          <img
            src={search_icon}
            alt="Search"
            className="ml-2 h-10 w-10 cursor-pointer rounded-full bg-white p-2"
            onClick={() => search(inputRef.current.value)}
          />
        </div>

        {weatherData ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <img src={weatherData.icon} alt="Weather Icon" className="h-24 w-24 mb-4" />
              <p className="text-6xl font-bold mb-2">{weatherData.temperature}°C</p>
              <p className="text-2xl">{weatherData.location}</p>
            </div>

            <div className="flex justify-between text-base text-gray-200 mt-6">
              <div className="flex items-center space-x-4">
                <img src={humidity_icon} alt="Humidity" className="h-8 w-8" />
                <div className="flex flex-col whitespace-nowrap">
                  <span className="text-lg">{weatherData.humidity}%</span>
                  <p className="text-md text-gray-300">Humidity</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 ml-4 whitespace-nowrap">
                <img src={wind_icon} alt="Wind Speed" className="h-8 w-8" />
                <div className="flex flex-col">
                  <span className="text-lg">{weatherData.windSpeed} km/h</span>
                  <p className="text-md text-gray-300">Wind Speed</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">No data available</div>
        )}
      </div>
    </div>
  );
};

export default Weather;

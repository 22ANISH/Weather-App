import React, { useEffect, useRef, useState } from 'react';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png'; // Adding icons for humidity and wind

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [isDay, setIsDay] = useState(true); // Track if it’s day or night

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

  // Function to group forecast data by day
  const groupForecastByDay = (list) => {
    const dailyData = {};
    list.forEach((item) => {
      const date = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          humidity: [],
          windSpeed: [],
          weatherIcon: item.weather[0].icon,
        };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].humidity.push(item.main.humidity);
      dailyData[date].windSpeed.push(item.wind.speed);
    });

    return Object.keys(dailyData).map((date) => ({
      date,
      temperature: (Math.max(...dailyData[date].temps) - 273.15).toFixed(2),
      humidity: Math.max(...dailyData[date].humidity),
      windSpeed: Math.max(...dailyData[date].windSpeed),
      icon: allIcons[dailyData[date].weatherIcon] || clear_icon,
    }));
  };

  const search = async (city) => {
    if (city === '') {
      alert('Enter city name');
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Current weather data
      const weatherIcon = data.list[0].weather[0].icon;
      const icon = allIcons[weatherIcon] || clear_icon;
      setIsDay(weatherIcon.includes('d')); // Check if day (d) or night (n)

      setWeatherData({
        location: data.city.name,
        temperature: (data.list[0].main.temp - 273.15).toFixed(2),
        icon: icon,
        humidity: data.list[0].main.humidity,
        windSpeed: data.list[0].wind.speed,
      });

      // Forecast data
      const forecast = groupForecastByDay(data.list);
      setForecastData(forecast.slice(1, 5)); // Show only the next 4 days
    } catch (error) {
      setWeatherData(false);
      setForecastData([]);
      console.log('Error in fetching weather data');
    }
  };

  useEffect(() => {
    search('New York'); // Initial search when component loads
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        isDay ? 'bg-blue-400' : 'bg-gray-800'
      } space-y-8 p-6`}
    >
      {/* Today's Weather + Search */}
      <div
        className={`${
          isDay ? 'bg-gradient-to-b from-blue-600 to-blue-500' : 'bg-gradient-to-b from-gray-900 to-gray-700'
        } rounded-2xl p-8 shadow-lg text-white w-96 space-y-4`}
      >
        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search City"
            className="w-full py-2 px-4 rounded-l-full text-black focus:outline-none"
          />
          <button
            className="bg-white rounded-r-full p-2"
            onClick={() => search(inputRef.current.value)}
          >
            <img src={search_icon} alt="Search" className="h-6 w-6" />
          </button>
        </div>

        {/* Current Weather */}
        {weatherData && (
          <div className="text-center">
            <h2 className="text-2xl font-bold">{weatherData.location}</h2>
            <img src={weatherData.icon} alt="Weather Icon" className="h-24 mx-auto mb-4" />
            <p className="text-6xl font-bold">{weatherData.temperature}°C</p>
            <div className="flex justify-around mt-4">
              <div className="flex items-center space-x-2">
                <img src={humidity_icon} alt="Humidity" className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Humidity</p>
                  <p>{weatherData.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <img src={wind_icon} alt="Wind" className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Wind Speed</p>
                  <p>{weatherData.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4-Day Forecast */}
      <div className="w-full max-w-4xl space-y-4">
        <h2 className="text-xl font-bold text-white text-center mb-4">Next 4-Day Forecast</h2>
        <div className="flex justify-center space-x-4 overflow-x-auto">
          {forecastData.map((day, index) => (
            <div
              key={index}
              className={`${
                isDay ? 'bg-gradient-to-b from-blue-500 to-purple-600' : 'bg-gradient-to-b from-gray-800 to-gray-600'
              } rounded-lg p-6 shadow-lg text-white w-48 flex-shrink-0`}
            >
              <p className="text-lg font-semibold mb-2 text-center">{day.date}</p>
              <img src={day.icon} alt="Weather Icon" className="h-16 mx-auto my-4" />
              <p className="text-4xl font-bold mb-2">{day.temperature}°C</p>
              <div className="flex justify-between mt-2">
                <div className="flex flex-col items-center">
                  <img src={humidity_icon} alt="Humidity" className="h-6 w-6 mb-1" />
                  <p className="font-semibold">Humidity</p>
                  <p>{day.humidity}%</p>
                </div>
                <div className="flex flex-col items-center">
                  <img src={wind_icon} alt="Wind" className="h-6 w-6 mb-1" />
                  <p className="font-semibold">Wind</p>
                  <p>{day.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;

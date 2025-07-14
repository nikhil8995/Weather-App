const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;

console.log('Loaded WeatherAPI Key:', WEATHERAPI_KEY);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/weather', async (req, res) => {
  const { location } = req.query;
  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }
  try {
    const response = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
      params: {
        key: WEATHERAPI_KEY,
        q: location,
        days: 3,
        aqi: 'yes',
        alerts: 'no',
      },
    });
    const data = response.data;
    // Format current weather
    const current = {
      name: data.location.name,
      main: {
        temp: data.current.temp_c,
        feels_like: data.current.feelslike_c,
        humidity: data.current.humidity,
      },
      wind: {
        speed: data.current.wind_kph,
      },
      weather: [{
        main: data.current.condition.text,
        description: data.current.condition.text,
        icon: data.current.condition.icon,
      }],
      precipitation_mm: data.forecast.forecastday[0].day.totalprecip_mm,
      air_quality: data.current.air_quality ? data.current.air_quality.pm2_5 : null,
      uv: data.current.uv,
    };
    // Format 3-day forecast
    const forecast = data.forecast.forecastday.map(day => ({
      date: day.date,
      day: {
        maxtemp_c: day.day.maxtemp_c,
        mintemp_c: day.day.mintemp_c,
        avgtemp_c: day.day.avgtemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
      }
    }));
    // Format all 24 hourly slots for today
    const hourly = data.forecast.forecastday[0].hour.map(h => ({
      time: h.time,
      temp_c: h.temp_c,
      condition: h.condition.text,
      icon: h.condition.icon,
    }));
    res.json({ current, forecast, hourly });
  } catch (error) {
    if (error.response) {
      console.error('WeatherAPI error:', error.response.data);
      res.status(500).json({ error: error.response.data });
    } else {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
}); 
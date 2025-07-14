# Weather App

A beautiful, modern weather web app with animated backgrounds, dark mode, and detailed weather info. Built with Node.js, Express, HTML, CSS, and JavaScript, using the WeatherAPI.com service.

## Features
- Search weather by location (city, town, etc.)
- Current weather with temperature, feels-like, humidity, wind, precipitation, air quality (PM2.5), and UV index
- Animated backgrounds for sun, rain, clouds, snow, thunder, and fog
- 3-day forecast with icons and high/low temps
- Hourly forecast for today (all 24 hours, scrollable)
- Responsive, mobile-friendly design
- Dark mode toggle with sun/moon switch

## Setup
1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Get a free API key from [WeatherAPI.com](https://www.weatherapi.com/)**
4. **Create a `.env` file in the project root:**
   ```env
   WEATHERAPI_KEY=your_api_key_here
   ```
5. **Start the server**
   ```bash
   node server.js
   ```
6. **Open your browser:**
   - Visit `http://localhost:3000` (or your server's IP)

## Environment Variables
- `WEATHERAPI_KEY` — Your WeatherAPI.com API key

## Customization
- Edit `public/style.css` for UI/theme changes
- Edit `public/script.js` for frontend logic/animations
- Edit `server.js` for backend/API logic

## Deployment
- The app listens on all interfaces (`0.0.0.0:3000`) by default
- Can be hosted on any server that supports Node.js

## License
MIT # Weather-App
# Weather-App

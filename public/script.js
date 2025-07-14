document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('weatherForm');
  const locationInput = document.getElementById('locationInput');
  const weatherInfo = document.getElementById('weatherInfo');
  const animation = document.getElementById('animation');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const lightModeBtn = document.getElementById('lightModeBtn');
  const darkModeBtn = document.getElementById('darkModeBtn');
  const forecastContainer = document.createElement('div');
  forecastContainer.id = 'forecastContainer';
  document.querySelector('.container').appendChild(forecastContainer);

  const hourlyContainer = document.createElement('div');
  hourlyContainer.id = 'hourlyContainer';
  document.querySelector('.container').appendChild(hourlyContainer);

  // Move hourlyContainer before forecastContainer
  document.querySelector('.container').insertBefore(hourlyContainer, forecastContainer);

  function updateModeButtons() {
    if (document.body.classList.contains('dark')) {
      darkModeBtn.classList.add('active');
      lightModeBtn.classList.remove('active');
    } else {
      lightModeBtn.classList.add('active');
      darkModeBtn.classList.remove('active');
    }
  }

  // Initial state
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
    darkModeToggle.checked = true;
  }

  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'disabled');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = locationInput.value.trim();
    if (!location) return;
    weatherInfo.textContent = 'Loading...';
    animation.innerHTML = '';
    forecastContainer.innerHTML = '';
    try {
      const res = await fetch(`/weather?location=${encodeURIComponent(location)}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      updateWeatherDisplay(data);
    } catch (err) {
      weatherInfo.textContent = 'Could not get weather data.';
    }
  });

  function updateWeatherDisplay(data) {
    if (!data || !data.current || !data.current.weather || !data.current.weather[0]) {
      weatherInfo.textContent = 'No weather data found.';
      animation.innerHTML = '';
      forecastContainer.innerHTML = '';
      return;
    }
    const temp = data.current.main.temp;
    const feels = data.current.main.feels_like;
    const humidity = data.current.main.humidity;
    const wind = data.current.wind.speed;
    const desc = data.current.weather[0].description;
    const icon = data.current.weather[0].icon;
    const main = desc.toLowerCase();
    const precipitation = data.current.precipitation_mm;
    const airQuality = data.current.air_quality;
    const uv = data.current.uv;
    weatherInfo.innerHTML = `<h2>${data.current.name}</h2>
      <img src="${icon}" alt="icon" style="vertical-align:middle;width:48px;height:48px;">
      <p>${temp}&deg;C (feels like ${feels}&deg;C), ${desc}</p>
      <p>Humidity: ${humidity}% | Wind: ${wind} kph</p>
      <p>Precipitation: ${precipitation} mm | Air Quality (PM2.5): ${airQuality ? airQuality.toFixed(1) : 'N/A'} | UV Index: ${uv}</p>`;
    if (main.includes('rain')) {
      showRain();
    } else if (main.includes('cloud')) {
      showCloud();
    } else if (main.includes('sun') || main.includes('clear')) {
      showSun();
    } else if (main.includes('snow')) {
      showSnow();
    } else if (main.includes('thunder')) {
      showThunder();
    } else if (main.includes('fog') || main.includes('mist')) {
      showFog();
    } else {
      animation.innerHTML = '';
    }
    // Show hourly
    if (data.hourly && Array.isArray(data.hourly)) {
      hourlyContainer.innerHTML = '<h3>Today\'s Hourly</h3>' +
        '<div class="hourly-cards">' +
        data.hourly.map(h => {
          const hour = new Date(h.time).getHours();
          const ampm = hour === 0 ? '12am' : hour < 12 ? hour + 'am' : (hour === 12 ? '12pm' : (hour-12) + 'pm');
          return `
            <div class="hourly-card">
              <div>${ampm}</div>
              <img src="${h.icon}" alt="icon" style="width:32px;height:32px;">
              <div>${h.temp_c}&deg;C</div>
              <div style="font-size:0.8em;">${h.condition}</div>
            </div>
          `;
        }).join('') + '</div>';
    } else {
      hourlyContainer.innerHTML = '';
    }
    // Show forecast
    if (data.forecast && Array.isArray(data.forecast)) {
      forecastContainer.innerHTML = '<h3>3-Day Forecast</h3>' +
        '<div class="forecast-cards">' +
        data.forecast.map(day => `
          <div class="forecast-card">
            <div>${day.date}</div>
            <img src="${day.day.icon}" alt="icon" style="width:40px;height:40px;">
            <div>${day.day.condition}</div>
            <div>High: ${day.day.maxtemp_c}&deg;C</div>
            <div>Low: ${day.day.mintemp_c}&deg;C</div>
          </div>
        `).join('') + '</div>';
    } else {
      forecastContainer.innerHTML = '';
    }
  }

  function showSun() {
    animation.innerHTML = '<div class="sunny"><div class="sun"></div></div>';
  }
  function showCloud() {
    animation.innerHTML = '<div class="cloudy"><div class="cloud"></div></div>';
  }
  function showRain() {
    animation.innerHTML = '<div class="rainy"><div class="cloud"></div><div class="rain">' +
      '<div class="drop"></div><div class="drop"></div><div class="drop"></div><div class="drop"></div>' +
      '</div></div>';
  }
  function showSnow() {
    animation.innerHTML = '<div class="snowy"><div class="cloud"></div><div class="snow">' +
      '<div class="flake"></div><div class="flake"></div><div class="flake"></div>' +
      '</div></div>';
  }
  function showThunder() {
    animation.innerHTML = '<div class="thunder"><div class="cloud"></div><div class="lightning">' +
      '<div class="bolt"></div><div class="bolt"></div>' +
      '</div></div>';
  }
  function showFog() {
    animation.innerHTML = '<div class="foggy"><div class="cloud"></div><div class="fog">' +
      '<div class="fog-particle"></div><div class="fog-particle"></div>' +
      '</div></div>';
  }
}); 
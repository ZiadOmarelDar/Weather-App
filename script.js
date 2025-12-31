/* ================== Elements ================== */
const form = document.getElementById('weather-form');
const input = document.getElementById('location-input');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const weatherMain = document.getElementById('weather-main');
const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const currentDate = document.getElementById('current-date');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const weatherIcon = document.getElementById('weather-icon');
const forecastList = document.getElementById('forecast-list');

let myChart = null;
const CACHE_DURATION = 10 * 60 * 1000;

/* ================== UI ================== */
function showLoading() {
  loading.classList.remove('hidden');
  weatherMain.classList.add('hidden');
  errorMessage.classList.add('hidden');
}

function hideLoading() {
  loading.classList.add('hidden');
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
  weatherMain.classList.add('hidden');
}

/* ================== Cache ================== */
function cacheData(key, data) {
  localStorage.setItem(key, JSON.stringify({ data, time: Date.now() }));
}

function getCachedData(key) {
  const item = localStorage.getItem(key);
  if (!item) return null;
  const parsed = JSON.parse(item);
  return Date.now() - parsed.time < CACHE_DURATION ? parsed.data : null;
}

/* ================== Weather Codes ================== */
function getWeatherDescription(code) {
  const map = {
    0: ['سماء صافية', '01d'],
    1: ['غالبًا صافية', '02d'],
    2: ['غائم جزئيًا', '03d'],
    3: ['غائم', '04d'],
    45: ['ضباب', '50d'],
    48: ['ضباب كثيف', '50d'],
    51: ['رذاذ خفيف', '09d'],
    53: ['رذاذ متوسط', '09d'],
    55: ['رذاذ كثيف', '09d'],
    61: ['مطر خفيف', '10d'],
    63: ['مطر متوسط', '10d'],
    65: ['مطر غزير', '10d'],
    71: ['ثلج خفيف', '13d'],
    73: ['ثلج متوسط', '13d'],
    75: ['ثلج كثيف', '13d'],
    80: ['زخات مطر', '09d'],
    81: ['زخات متوسطة', '09d'],
    82: ['زخات غزيرة', '09d'],
    95: ['عاصفة رعدية', '11d'],
    99: ['عاصفة قوية', '11d'],
  };
  return map[code] || ['طقس غير معروف', '01d'];
}

/* ================== Geocoding ================== */
async function getCoordinates(city) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=ar`
  );

  if (!res.ok) throw new Error('المدينة غير موجودة');

  const data = await res.json();
  if (!data.results?.length) throw new Error('لم يتم العثور على المدينة');

  const r = data.results[0];
  const name = [r.name, r.admin1, r.country].filter(Boolean).join('، ');

  return { lat: r.latitude, lon: r.longitude, name };
}

/* ================== Weather API (FIXED) ================== */
async function fetchWeatherData(lat, lon, key) {
  const cacheKey = `weather_${key}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  lat = Number(lat);
  lon = Number(lon);

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&forecast_days=7` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('فشل جلب بيانات الطقس');

  const data = await res.json();
  const result = { current: data.current, daily: data.daily };
  cacheData(cacheKey, result);
  return result;
}

/* ================== Display ================== */
function displayWeather(data, place) {
  const [desc, icon] = getWeatherDescription(data.current.weather_code);

  currentDate.textContent = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  locationName.textContent = place;
  temperature.textContent = `${Math.round(data.current.temperature_2m)}°`;
  description.textContent = desc;
  humidity.textContent = `الرطوبة: ${data.current.relative_humidity_2m}%`;
  windSpeed.textContent = `الرياح: ${Math.round(
    data.current.wind_speed_10m
  )} كم/س`;

  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  weatherMain.classList.remove('hidden');

  if (myChart) myChart.destroy();
  myChart = new Chart(document.getElementById('temp-chart'), {
    type: 'line',
    data: {
      labels: data.daily.time.map((d) =>
        new Date(d).toLocaleDateString('ar', { weekday: 'short' })
      ),
      datasets: [
        {
          data: data.daily.temperature_2m_max,
          tension: 0.4,
          fill: true,
        },
      ],
    },
  });

  forecastList.innerHTML = '';
  for (let i = 1; i < data.daily.time.length; i++) {
    const [_, ic] = getWeatherDescription(data.daily.weather_code[i]);
    forecastList.innerHTML += `
      <div class="forecast-item">
        <p>${new Date(data.daily.time[i]).toLocaleDateString('ar', {
          weekday: 'short',
        })}</p>
        <img src="https://openweathermap.org/img/wn/${ic}.png">
        <p>${Math.round(data.daily.temperature_2m_max[i])}° /
          ${Math.round(data.daily.temperature_2m_min[i])}°</p>
      </div>
    `;
  }
}

/* ================== Events ================== */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showLoading();
  try {
    const loc = await getCoordinates(input.value);
    const data = await fetchWeatherData(loc.lat, loc.lon, input.value);
    displayWeather(data, loc.name);
    hideLoading();
  } catch (e) {
    hideLoading();
    showError(e.message);
  }
});


/* ================== Auto Location ================== */
document.addEventListener('DOMContentLoaded', () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async (pos) => {
    showLoading();
    try {
      const data = await fetchWeatherData(
        pos.coords.latitude,
        pos.coords.longitude,
        'geo'
      );
      displayWeather(data, 'موقعك الحالي');
      hideLoading();
    } catch {
      hideLoading();
      showError('تعذر جلب طقس موقعك');
    }
  });
});

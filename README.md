# Weather Forecast App

A fully functional weather forecasting web application built with HTML, CSS, and JavaScript. This app integrates with the OpenWeatherMap API to provide current weather data and 5-day forecasts for user-specified locations.

## Features

- **Current Weather Display**: Shows temperature, humidity, wind speed, weather description, and icon.
- **5-Day Forecast**: Displays daily high/low temperatures with weather icons.
- **Location Search**: Enter city name or zip code to get weather data.
- **Geolocation Support**: Automatically detects and displays weather for your current location on page load.
- **Responsive Design**: Mobile-friendly layout that works on all devices.
- **Error Handling**: Displays user-friendly messages for invalid inputs or API failures.
- **Loading Indicators**: Shows a spinner while fetching data from the API.

## Technologies Used

- HTML5
- CSS3 (with Flexbox for responsive layout)
- JavaScript (ES6+ with async/await)
- OpenWeatherMap API

## Setup Instructions

1. **Clone or Download**: Download the project files to your local machine.

2. **API Key**: The app is pre-configured with an API key. If you want to use your own:

   - Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/)
   - Get your API key from the dashboard
   - Replace the `API_KEY` variable in `script.js` with your key

3. **Open the App**: Simply open `index.html` in your web browser. No server required!

## Usage

1. **Automatic Location**: On page load, the app will attempt to get your current location's weather.
2. **Manual Search**: Enter a city name (e.g., "London") or zip code in the input field and click "Get Weather".
3. **View Results**: Current weather and 5-day forecast will be displayed below.

## API Endpoints Used

- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `https://api.openweathermap.org/data/2.5/forecast`

## Deployment

### GitHub Pages

1. Create a new repository on GitHub.
2. Upload all project files (`index.html`, `styles.css`, `script.js`, `README.md`).
3. Go to Settings > Pages.
4. Select "main" branch as source and save.
5. Your app will be live at `https://yourusername.github.io/repository-name/`

### Other Hosting Options

- Upload files to any web server (e.g., Netlify, Vercel, AWS S3).
- For local testing, just open `index.html` in a browser.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Feel free to fork this project and add new features like:

- Hourly forecasts
- Weather maps
- Multiple location favorites
- Dark mode toggle

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from OpenWeatherMap API

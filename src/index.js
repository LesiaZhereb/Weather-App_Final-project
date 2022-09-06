let searchButton = document.querySelector(".search_button");
let locationButton = document.querySelector(".location_button");
let searchFormInput = document.querySelector(".search-form__input");
let dateNow = new Date();
let currentDate = document.querySelector(".searched_city_dateChange");
let celsiusTemperature = "0";

function getForecastByCoordinates(coordinates) {
  const apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecastbyDays);
  axios.get(apiUrl).then(displayForecastByHours);
}

function getDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fr", "Sat"];
  let day = days[date.getDay()];
  return day;
}

function getHours(timestamp) {
  let forecastHour = new Date(timestamp * 1000);

  let time = forecastHour.getHours();
  return time;
}

function displayForecastByHours(response) {
  let hourlyForecast = response.data.hourly;
  let hourlyForecastElement = document.querySelector(".weather_by_hours");
  let hourlyForecastHTML = "";
  hourlyForecast.forEach(function (forecastHour, index) {
    if (index > 0 && index < 11) {
      let iconName = iconConvert[forecastHour.weather[0].icon];
      hourlyForecastHTML =
        hourlyForecastHTML +
        ` 
                  <div class="weather_by_hours_item" >
                    <time class="weather_by_hours__time">
                      ${getHours(forecastHour.dt)}:00
                    </time>
                    <span class="weather_by_hours__icon">
                      <img src="svg/${iconName}.svg"
                           class="weather_by_hours__icon"
                           alt="${iconName}"
                      />
                    </span>
                    <p class="weather_by_hours__temp">
                      ${Math.round(forecastHour.temp)}℃
                    </p>
                  </div>
               `;
    }
  });
  console.log(hourlyForecast);
  hourlyForecastElement.innerHTML = hourlyForecastHTML;
}

function displayForecastbyDays(response) {
  let dailyForecast = response.data.daily;
  console.log(dailyForecast);
  let forecastbyDaysElement = document.querySelector("#forecast_by_days");
  let forecastHTML = "";
  dailyForecast.forEach(function (forecastDay, index) {
    if (index > 0 && index <= 5) {
      let iconName = iconConvert[forecastDay.weather[0].icon];

      forecastHTML =
        forecastHTML +
        `
	      <div class="forecast-by-days_item">
	        <div class="forecast-by-days_day">${getDay(forecastDay.dt)}</div>
	        <span class="forecast-by-days__icon">
	          <img src="svg/${iconName}.svg"
	               class="icon-forecast"
	               alt="${iconName}"          
	          />
	        </span>
	        <p class="forecast-by-days__temp">
	          <span class="forecast-by-days_day_temp">
                ${Math.round(forecastDay.temp.max)}℃
              </span> | ${Math.round(forecastDay.temp.min)}℃
	        </p>
	      </div>
	  `;
    }
  });
  forecastbyDaysElement.innerHTML = forecastHTML;
}

let iconConvert = {
  "01d": "clearsky",
  "01n": "clearsky",
  "02d": "fewclouds",
  "02n": "fewclouds",
  "03d": "scatteredclouds",
  "03n": "scatteredclouds",
  "04d": "brokenclouds",
  "04n": "brokenclouds",
  "09d": "showerrain",
  "09n": "showerrain",
  "10d": "rain",
  "10n": "rain",
  "11d": "thunderstorm",
  "11n": "thunderstorm",
  "13d": "snow",
  "13n": "snow",
  "50d": "mist",
  "50n": "mist",
};

function timeConvert(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const updateHours = hours < 10 ? "0" + hours : hours;
  const updateMinutes = minutes < 10 ? "0" + minutes : minutes;
  const time = updateHours + ":" + updateMinutes;
  return time;
}
function showTemperature(response) {
  console.log(response.data);
  let cityElement = document.querySelector(".searched_city_name");
  let sunriseTimeElement = document.querySelector(".sunrise_time");
  let sunsetTimeElement = document.querySelector(".sunrise_time");
  let feelsLikeElement = document.querySelector(".feelsLikeTemp");
  let humidityElement = document.querySelector(".Humidity");
  let windSpeedElement = document.querySelector(".wind_speed");
  let pressureElement = document.querySelector(".Pressure_data");
  let temperatureElement = document.querySelector(".searched_city-info__temp");
  let iconElement = document.querySelector("#icon");
  let iconPath = iconConvert[response.data.weather[0].icon];
  celsiusTemperature = response.data.main.temp;

  cityElement.innerHTML = response.data.name;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  sunriseTimeElement.innerHTML = timeConvert(response.data.sys.sunrise);
  sunsetTimeElement.innerHTML = timeConvert(response.data.sys.sunset);
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  pressureElement.innerHTML = response.data.main.pressure;

  iconElement.setAttribute("src", `svg/${iconPath}.svg`);
  iconElement.setAttribute("alt", `response.data.weather[0].description`);
  getForecastByCoordinates(response.data.coord);
}

function changeCity(event) {
  event.preventDefault();
  let searchedCity = searchFormInput.value;

  getCityWeather(searchedCity);
}

function getCityWeather(city) {
  const apiKey = "ee4b364710ec488f16dbd059f25342e2";
  const apiCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  if (city) {
    axios.get(apiCityUrl).then(showTemperature);
  } else {
    alert("Please enter your city");
  }
}

function handlePosition(position) {
  const apiKey = "ee4b364710ec488f16dbd059f25342e2";
  const units = "metric";
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(weatherApiUrl).then(showTemperature);
}

function showLocationWeather(event) {
  event.preventDefault();
  searchFormInput.value = "";
  navigator.geolocation.getCurrentPosition(handlePosition);
}

function changedDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = days[dateNow.getDay()];
  let month = months[dateNow.getMonth()];
  let todayDate = dateNow.getDate();
  let hr = dateNow.getHours();
  let min = dateNow.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  let time = hr + ":" + min;
  let formattedDate = ` ${month} ${todayDate}<br />${day} ${time}`;
  return formattedDate;
}

locationButton.addEventListener("click", showLocationWeather);
document.querySelector(".search-form").addEventListener("submit", changeCity);
currentDate.innerHTML = changedDate(dateNow);
getCityWeather("Kyiv");

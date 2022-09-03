let searchButton = document.querySelector(".search_button");
let locationButton = document.querySelector(".location_button");
let dateNow = new Date();
let currentDate = document.querySelector(".searched_city_dateChange");
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
function capitalizeFirstLetter(inputString) {
  return inputString[0].toUpperCase() + inputString.slice(1);
}

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
  let cityElement = document.querySelector(".searched_city_name");
  let sunriseTimeElement = document.querySelector(".sunrise_time");
  let sunsetTimeElement = document.querySelector(".sunrise_time");
  let feelsLikeElement = document.querySelector(".feelsLikeTemp");
  let humidityElement = document.querySelector(".Humidity");
  let windSpeedElement = document.querySelector(".wind_speed");
  let pressureElement = document.querySelector(".Pressure_data");
  let tempElement = document.querySelector(".searched_city-info__temp");
  let iconElement = document.querySelector("#icon");
  celsiusTemperatuire = response.data.main.temp;

  cityElement.innerHTML = response.data.name;
  tempElement.innerHTML = Math.round(celsiusTemperatuire);
  sunriseTimeElement.innerHTML = response.data.sys.sunrise;
  sunsetTimeElement.innerHTML = response.data.sys.sunset;
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  pressureElement.innerHTML = response.data.main.pressure;
  let iconPath = iconConvert[response.data.weather[0].icon];
  iconElement.setAttribute("src", `svg/${iconPath}.svg`);
  iconElement.setAttribute("alt", `response.data.weather[0].description`);
}

function changeCity(event) {
  const apiKey = "ee4b364710ec488f16dbd059f25342e2";
  let searchedCity = document.querySelector(".search-form__input").value;
  searchInput = capitalizeFirstLetter(searchInput);
  const apiCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&units=metric&appid=${apiKey}`;
  const currentCityElement = document.querySelector(".searched_city_name");

  if (searchedCity) {
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
let temperatureType = "celsius";

function cToF(event) {
  event.preventDefault();
  if (temperatureType === "farenheit") {
    return;
  }
  let tempElement = document.querySelector(".searched_city-info__temp");
  let fTempConvert = (celsiusTemperatuire * 9) / 5 + 32;
  tempElement.innerHTML = fTempConvert;

  temperatureType = "farenheit";
}

function fToC(event) {
  event.preventDefault();
  if (temperatureType === "celsius") {
    return;
  }

  console.dir(celsiusTemperatuire);

  let tempElement = document.querySelector(".searched_city-info__temp");

  tempElement.innerHTML = Math.round(celsiusTemperatuire);

  temperatureType = "celsius";
}

searchButton.addEventListener("click", changeCity);
locationButton.addEventListener("click", showLocationWeather);
currentDate.innerHTML = changedDate(dateNow);
fTemp.addEventListener("click", cToF);
cTemp.addEventListener("click", fToC);

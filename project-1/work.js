const API_KEY = "d25c996e1d912ac3eaa0c2dab9978428";

document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.querySelector(".search");
  const searchBtn = document.querySelector(".btn");
  const weatherContainer = document.querySelector(".container");
  const weatherShow = document.querySelector(".weather-show");

  const cityName = document.querySelector(".city");
  const temp = document.querySelector(".summary .temp");
  const weatherType = document.querySelector(".weather-type");
  const humidity = document.querySelectorAll(".conditon-value")[0];
  const windSpeed = document.querySelectorAll(".conditon-value")[1];
  const dateTime = document.querySelector(".datetime");
  const weatherIcon = document.querySelector(".weather-icon");

  const forecastCards = document.querySelectorAll(".forcast");

  searchBtn.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city === "") {
      alert("Enter city name");
      return;
    }
    getCurrentWeather(city);
    getForecast(city);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  // ================= CURRENT WEATHER =================
  function getCurrentWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
      .then(res => {
        if (!res.ok) throw new Error("Error");
        return res.json();
      })
      .then(data => updateCurrentWeather(data))
      .catch(() => alert("City not found"));
  }

  function updateCurrentWeather(data) {
    cityName.innerText = data.name;
    temp.innerHTML = Math.round(data.main.temp) + "°C";
    weatherType.innerText = data.weather[0].main;
    humidity.innerText = data.main.humidity + "%";
    windSpeed.innerText = data.wind.speed + " m/s";

    const now = new Date();
    dateTime.innerText = now.toDateString();

    const condition = data.weather[0].main.toLowerCase();
    if (condition.includes("cloud")) weatherIcon.src = "cloudy.png";
    else if (condition.includes("rain")) weatherIcon.src = "storm.png";
    else weatherIcon.src = "image/cloudy.png";

    weatherShow.style.display = "none";
    weatherContainer.style.display = "flex";
  }

  // ================= 5 DAY FORECAST =================
  function getForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => updateForecast(data));
  }

  function updateForecast(data) {
    // Pick one forecast per day (every 8th item = 24 hours)
    for (let i = 0; i < forecastCards.length; i++) {
      const forecastData = data.list[i * 8];
      if (!forecastData) return;

      const date = new Date(forecastData.dt * 1000);
      const day = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short"
      });

      forecastCards[i].querySelector(".today-forcast").innerText = day;
      forecastCards[i].querySelector(".temp").innerHTML =
        Math.round(forecastData.main.temp) + "°C";

      const icon = forecastData.weather[0].main.toLowerCase();
      const img = forecastCards[i].querySelector("img");

      if (icon.includes("cloud")) img.src = "image/cloudy.png";
      else if (icon.includes("rain")) img.src = "image/storm.png";
      else img.src = "image/cloudy.png";
    }
  }
});

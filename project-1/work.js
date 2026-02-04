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

  searchBtn.addEventListener("click", searchWeather);
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") searchWeather();
  });

  function searchWeather() {
    const city = searchInput.value.trim();
    if (city === "") return alert("Please enter a city name.");
    getCurrentWeather(city);
    getForecast(city);
  }

  function getCurrentWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        cityName.innerText = data.name;
        temp.innerText = Math.round(data.main.temp) + "°C";
        weatherType.innerText = data.weather[0].main;
        humidity.innerText = data.main.humidity + "%";
        windSpeed.innerText = data.wind.speed + " m/s";
        dateTime.innerText = new Date().toDateString();

        setIcon(data.weather[0].main, weatherIcon);

        weatherShow.style.display = "none";
        weatherContainer.style.display = "flex";
      });
  }

  function getForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        for (let i = 0; i < forecastCards.length; i++) {
          const item = data.list[i * 8];
          if (!item) return;

          forecastCards[i].querySelector(".today-forcast").innerText =
            new Date(item.dt * 1000).toLocaleDateString("en-US", { day: "numeric", month: "short" });

          forecastCards[i].querySelector(".temp").innerText =
            Math.round(item.main.temp) + "°C";

          const img = forecastCards[i].querySelector(".forcast-icon");
          setIcon(item.weather[0].main, img);
        }
      });
  }

  // ✅ SINGLE CORRECT ICON FUNCTION
  function setIcon(condition, img) {
    const text = condition.toLowerCase();

    if (text.includes("cloud")) img.src = "image/cloudy.png";
    else if (text.includes("rain") || text.includes("drizzle")) img.src = "image/storm.png";
    else img.src = "image/cloudy.png"; // safe fallback
  }

});

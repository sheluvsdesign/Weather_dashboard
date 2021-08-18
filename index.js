// declare variables
var searchHistory = [];
var weatherApiKey = "e88a36121844f522ddc72a5fb79188e2";

var searchForm = document.querySelector("#searchForm");
var searchInput = document.querySelector("#searchInput");
var todayContainer = document.querySelector("#today");
var forecastContainer = document.querySelector("#forecast");

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function handleFormSubmit(e) {
  e.preventDefault();
  var search = searchInput.value.trim();

  fetchCityCoords(search);
  searchInput.value = "";
}

function fetchCityCoords(search) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${weatherApiKey}`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data) {
        alert("city not found");
      } else {
        addCityToHistory(search);
        fetchWeatherData(data);
        // console.log(data)
      }
    });
}

function addCityToHistory(search) {
  searchHistory.push(search);
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
}

function fetchWeatherData(data) {
  var { lat } = data.coord;
  var { lon } = data.coord;
  var cityName = data.name;

  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      renderItems(cityName, data);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function renderItems(city, data) {
  renderCurrentWeather(city, data.current, data.timezone);
  renderForecast(data.daily, data.timezone);
}

function renderCurrentWeather(a, b, c) {
  var date = dayjs().tz(c).format("M/D/YYYY");

  // create variables for the data response
  var temp = b.temp;
  var icon = `https://openweathermap.org/img/w/${b.weather[0].icon}.png`
  var wind = b.wind_speed;
  var humidity = b.humidity;
  var uvi = b.uvi;
  var iconDescription = b.weather[0].iconDescription;

  // create the elements that need to be added to the container
  var card = document.createElement("div");
  var cardBody = document.createElement("div");
  var heading = document.createElement("h2");
  var tempEl = document.createElement("p");
  var windEl = document.createElement("p");
  var humidityEl = document.createElement("p");
  var uviEl = document.createElement("p");
  var iconEl = document.createElement('img');
  var uviBtn = document.createElement('button')
  

  // set new element attributes
  card.setAttribute("class", "card");
  cardBody.setAttribute("class", "card-body");
  card.append(cardBody);

  heading.setAttribute("class", "h3 card-title");
  tempEl.setAttribute("class", "card-text");
  windEl.setAttribute("class", "card-text");
  humidityEl.setAttribute("class", "card-text");
  iconEl.setAttribute('src', icon)
  iconEl.setAttribute("alt", iconDescription )

  heading.textContent = `${a} ${date}`;
  tempEl.textContent = `Temp: ${temp}F`;
  windEl.textContent = `Wind: ${wind} MPH`;
  humidityEl.textContent = `Humidity: ${humidity}%`;
  uviEl.textContent = "UV Index: ";
  uviBtn.classList.add('btn', 'btn-sm');
  uviBtn.textContent = uvi;
  uviEl.append(uviBtn);
  
  cardBody.append(heading, iconEl, tempEl, windEl, humidityEl, uviEl );


  todayContainer.innerHTML = "";
  todayContainer.append(card);
}

function renderForecast(dailyForcast, timezone){
  // create the timestamps to start the 5 day forecast and end the 5 day forecast. daily[0].dt = the unix time code we need to convert
  var startDt = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
  var endDt = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();

  // create elements for html
  var heading = document.createElement('div');
  var title = document.createElement('h4');

  heading.setAttribute('class', 'col-12');
  title.textContent = '5 Day Forecast: ';
  heading.append(title);

  forecastContainer.innerHTML = ''
  forecastContainer.append(heading)

  for (var i = 0; i < dailyForcast.length; i++) {
    // conditional statment to check to see the start and end date
    if(dailyForcast[i].dt >= startDt && dailyForcast[i].dt < endDt) {
      renderForecastCard(dailyForcast[i], timezone)
    }
    
  }


}

function renderForecastCard(forecast, timezone){
  var unixTz = forecast.dt
  var icon = `https://openweathermap.org/img/w/${b.weather[0].icon}.png`
  var iconDescription = forecast.weather[0].iconDescription;
  var temp = forecast.temp.day;
  var humidity = forecast.humidity;
  var wind = forecast.wind_speed;

  // create the elements for the card
  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var iconEl = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');
}

searchForm.addEventListener("submit", handleFormSubmit);

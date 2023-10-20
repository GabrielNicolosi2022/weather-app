const result = document.querySelector('.result');
const form = document.querySelector('.get-weather');
const nameCity = document.querySelector('#city');
const nameCountry = document.querySelector('#country');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (nameCity.value === '' || nameCountry.value === '') {
    showError('Ambos campos son obligatorios...');
    return;
  }

  callAPI(nameCity.value, nameCountry.value);
});

const callAPI = (city, country) => {
  const apiId = 'd42a2b5c86c4810e87bc200a80f6dce7';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&lang=es&appid=${apiId}`;

  fetch(url)
    .then((data) => {
      return data.json();
    })
    .then((dataJSON) => {
      if (dataJSON.cod === '404') {
        showError('Ciudad no encontrada...');
      } else {
        clearHTML();
        showWeather(dataJSON);
      }
      console.log(dataJSON);
    })
    .catch((error) => console.log(error));
};

const showWeather = (data) => {
  const {
    dt,
    name,
    weather: [arr],
    main: { humidity, pressure, temp, temp_min, temp_max },
    visibility,
    wind: { speed },
  } = data;

  const date = formatTime(dt);
  const degrees = kelvinToCelsius(temp);
  const min = kelvinToCelsius(temp_min);
  const max = kelvinToCelsius(temp_max);
  const velocity = msToKmh(speed);
  const dist = meterToKilometer(visibility);

  const content = document.createElement('div');
  content.innerHTML = `
        <h5>Clima en ${name}</h5>
        <h4>Hora actual: ${date}</h4>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icon">
        <h3>${arr.description}</h3>
        <h2> ${degrees}°C</h2>
        <p>Min: ${min}°C</p>
        <p>Max: ${max}°C</p>
        <p><span>Humedad: ${humidity}%</span> - 
        <span>P. atm.: ${pressure} hPa</span></p>
        <p><span>Viento: ${velocity} Km/h.</span> - 
        <span>Visibilidad: ${dist} Km.</span></p>
`;

  result.appendChild(content);
};

const showError = (message) => {
  const alert = document.createElement('p');
  alert.classList.add('alert-message');
  alert.innerHTML = message;

  form.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
};

const kelvinToCelsius = (temp) => parseInt(temp - 273.15);

const clearHTML = () => (result.innerHTML = '');

const formatTime = (dt) => {
  const timestampMs = dt * 1000;

  const date = new Date(timestampMs);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;

  return formattedTime;
};

const msToKmh = (number) => parseInt(number * 3.6);
// const msToKmh = (number) => number * 3.6;

const meterToKilometer = (number) => number / 1000;

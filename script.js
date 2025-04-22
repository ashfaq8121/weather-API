const countrySelect = document.getElementById("countrySelect");
const stateSelect   = document.getElementById("stateSelect");
const citySelect    = document.getElementById("citySelect");
const resultDiv     = document.getElementById("weatherResult");

// Data for countries, states, and cities/capitals
const data = {
  India: {
    "Andhra Pradesh":      ["Amaravati"],
    "Arunachal Pradesh":   ["Itanagar"],
    "Assam":               ["Dispur"],
    "Bihar":               ["Patna"],
    "Chhattisgarh":        ["Raipur"],
    "Goa":                 ["Panaji"],
    "Gujarat":             ["Gandhinagar"],
    "Haryana":             ["Chandigarh"],
    "Himachal Pradesh":    ["Shimla"],
    "Jharkhand":           ["Ranchi"],
    "Karnataka":           ["Bengaluru"],
    "Kerala":              ["Thiruvananthapuram"],
    "Madhya Pradesh":      ["Bhopal"],
    "Maharashtra":         ["Mumbai"],
    "Manipur":             ["Imphal"],
    "Meghalaya":           ["Shillong"],
    "Mizoram":             ["Aizawl"],
    "Nagaland":            ["Kohima"],
    "Odisha":              ["Bhubaneswar"],
    "Punjab":              ["Chandigarh"],
    "Rajasthan":           ["Jaipur"],
    "Sikkim":              ["Gangtok"],
    "Tamil Nadu":          ["Chennai"],
    "Telangana": [
      "Adilabad","Bhadradri Kothagudem","Jagtial","Jangaon","Jayashankar Bhupalapally",
      "Jogulamba Gadwal","Kamareddy","Karimnagar","Komaram Bheem Asifabad",
      "Khammam","Kumuram Bheem Asifabad","Mahbubnagar","Mancherial","Medak",
      "Medchal Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Nirmal","Nizamabad",
      "Peddapalli","Ranga Reddy","Sangareddy","Sircilla","Siddipet","Suryapet",
      "Tirupati","Vikarabad","Warangal","Warangal Rural","Wanaparthy","Yellandu","Hyderabad"
    ],
    "Tripura":             ["Agartala"],
    "Uttar Pradesh":       ["Lucknow"],
    "Uttarakhand":         ["Dehradun"],
    "West Bengal":         ["Kolkata"]
  },
  USA: {
    California: ["Los Angeles", "San Francisco"],
    Texas:      ["Dallas", "Houston"],
  },
  UK: {
    England: ["London", "Manchester"],
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa"],
  },
  Australia: {
    NewSouthWales: ["Sydney", "Newcastle"],
  },
};

// Populate country dropdown
function populateCountries() {
  for (let country in data) {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    countrySelect.appendChild(opt);
  }
}

// When country changes, reload states
countrySelect.addEventListener("change", () => {
  stateSelect.innerHTML = `<option value="">Select State</option>`;
  citySelect.innerHTML  = `<option value="">Select City</option>`;
  citySelect.disabled   = true;

  if (countrySelect.value) {
    stateSelect.disabled = false;
    const states = Object.keys(data[countrySelect.value]);
    states.forEach(st => {
      const opt = document.createElement("option");
      opt.value = st;
      opt.textContent = st;
      stateSelect.appendChild(opt);
    });
  } else {
    stateSelect.disabled = true;
  }
});

// When state changes, reload cities/capitals or districts
stateSelect.addEventListener("change", () => {
  citySelect.innerHTML = `<option value="">Select City</option>`;
  if (stateSelect.value) {
    citySelect.disabled = false;
    const cities = data[countrySelect.value][stateSelect.value];
    cities.forEach(ct => {
      const opt = document.createElement("option");
      opt.value = ct;
      opt.textContent = ct;
      citySelect.appendChild(opt);
    });
  } else {
    citySelect.disabled = true;
  }
});

// Fetch both current + tomorrow's weather
async function getWeather() {
  const city = citySelect.value;
  if (!city) {
    resultDiv.innerText = "Please select a city.";
    return;
  }

  const apiKey = "34b5529013fb418889a120651252104";
  const url    = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=2&aqi=yes`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      resultDiv.innerText = "City not found!";
      return;
    }
    const w = await res.json();

    // Current
    const { temp_c, condition, humidity } = w.current;
    const cityName   = w.location.name;
    const country    = w.location.country;
    const rawLocal   = w.location.localtime;         // e.g. "2025-04-22 18:45"
    const [date, time] = rawLocal.split(" ");
    let [h, m] = time.split(":").map(Number);
    const meridian = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const formattedTime = `${h}:${m.toString().padStart(2,"0")} ${meridian}`;

    // Tomorrow's forecast
    const tomorrowDay = w.forecast.forecastday[1].day;
    const { maxtemp_c, mintemp_c, condition: tomCond } = tomorrowDay;

    resultDiv.innerHTML = `
      <strong>${cityName}, ${country}</strong><br/>
      Temperature: ${temp_c}°C<br/>
      Condition: ${condition.text}<br/>
      Humidity: ${humidity}%<br/>
      <em>Local Time:</em> ${formattedTime} on ${date}<br/><br/>

      <strong>Tomorrow's Forecast:</strong><br/>
      High: ${maxtemp_c}°C &nbsp; Low: ${mintemp_c}°C<br/>
      Condition: ${tomCond.text}
    `;
  } catch (err) {
    resultDiv.innerText = "Error fetching weather data.";
  }
}

// Wire up the button and initialize
document.getElementById("getWeatherBtn")
        .addEventListener("click", getWeather);

populateCountries();

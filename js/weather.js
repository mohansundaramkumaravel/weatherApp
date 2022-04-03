const getLonandLat = async (city) => {
  const apiurl = `//api.positionstack.com/v1/forward?access_key=cfaec01244443b38dc6634cd96e9e746&query=${city}`;
  const resp = await fetch(apiurl);

  if (!resp.ok) { throw Error(resp.statusText); }

  const array = (await resp.json()).data;

  for (let json of array) {
    if (json.type === "locality") {
      return {
        lat: json.latitude,
        lon: json.longitude
      }
    }
  }

  throw Error("Can't Find City");
}

const getWeather = async (lat, lon) => {
  const apiurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6368f66267f86b0a8e874ad0ec13163b`;
  const resp = await fetch(apiurl);

  if (!resp.ok) { throw Error(resp.statusText); }

  return (await resp.json());
}

const queryParser = (query) => {
  const params = new Proxy(new URLSearchParams(query), {
    get: (target, prop) => target.get(prop)
  })
  return params;
}

const main = async () => {
  const Qparams = queryParser(window.location.search);
  const lonnLat = await getLonandLat(Qparams.city);
  const weather = await getWeather(lonnLat.lat, lonnLat.lon);

  const degree = document.getElementById("degree");
  const place = document.getElementById("place");
  const date = document.getElementById("date");

  degree.innerHTML = weather.main.temp;
  place.innerHTML = weather.name;
  date.innerHTML = new Date().toDateString();
}

window.onload =  async () => {
  try {
    await main()
  } catch(e) {
    alert(e)
  }
}

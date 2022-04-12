const getLonandLat = async (city) => {
  const options = {
    method: 'GET',
    url: 'https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi',
    params: {address: city},
    headers: {
      'X-RapidAPI-Host': 'address-from-to-latitude-longitude.p.rapidapi.com',
      'X-RapidAPI-Key': '5db44c9191msh3e9179c96ec7e50p1b96e8jsnbb5f80f4f3cb'
    }
  };
  
  const resp = await axios.request(options);
  const array = resp.data["Results"];

  if(array.length === 0) {
    throw Error("Can not find Place");
  }

  let [maxRelevance, idx] = [array[0]["Relevance"], 0];

  for (let i = 0; i < array.length; ++i) {
    console.log(array[i]);
    if(array[i]["Relevance"] > maxRelevance) {
      maxRelevance = array[i]["Relevance"];
      idx = i;
    }
  }

  return {
    lat: array[idx].latitude,
    lon: array[idx].longitude
  }
}

const getWeather = async (lat, lon) => {
  const apiurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6368f66267f86b0a8e874ad0ec13163b`;
  const resp = await axios.get(apiurl);

  return (await resp.data);
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

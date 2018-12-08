const getWeather = async (cityName) => {
  url = new URL(`https://api.openweathermap.org/data/2.5/forecast`)
  url.search = new URLSearchParams({
    appid: '463692f6a5af1bbd9009033cd6ccfe95',
    q: cityName,
    units: 'metric'
  })

  return await fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    })
    .catch(rej => {
      // TODO replace alert with something nicer
      window.alert(`Unable to find a city with a name "${cityName}"`)
      return rej
    })
}

// get average data for 5 days
const getAverageData = data => {
  const returnData = new Array(5)
  for(let d = 0; d < 5; d++) {
    let avgTemp = 0;
    let avgHumidity = 0;
    for(let h = 0; h < 8; h++) {
      avgTemp += data.list[d * 8 + h].main.temp
      avgHumidity += data.list[d * 8 + h].main.humidity
    }
    returnData[d] = {
      temp: Math.round(avgTemp / 8),
      humidity: Math.round(avgHumidity / 8)
    }
  }
  return returnData
}

// get city data on textbox submit
document.getElementById('city-search').addEventListener('submit', function(e){
  e.preventDefault();
  if(e.target.query.value.trim().length > 0) {
    getWeather(e.target.query.value)
    .then(data => {
      // TODO getAverageTemp(data) - wyrenderowac
      console.log(getAverageData(data))

      e.target.query.value = ""
    })
    .catch(rej => {})
  }
})
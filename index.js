const getWeather = (cityName) => {
  const url = new URL(`https://api.openweathermap.org/data/2.5/forecast`)
  url.search = new URLSearchParams({
    appid: '463692f6a5af1bbd9009033cd6ccfe95',
    q: cityName,
    units: 'metric'
  })

  return window.fetch(url)
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
  // get most frequent weather state out of the ones in the array
  const getMostFrequent = (array) => {
    const count = {}
    const max = {total: 0, key: array[0].main, icon: array[0].icon}

    array.forEach((c, i, a) => {
      if (!(c.main in count)) {
        count[c.main] = {total: 0, icon: c.icon}
        for (let j = i; j < a.length; j++) {
          if (c.main === a[j].main && ++count[c.main].total > max.total) {
            max.total = count[c.main].total
            max.key = c.main
            max.icon = count[c.main].icon
          }
        }
      }
    })
    return { key: max.key, icon: max.icon }
  }

  const returnData = []
  for (let d = 0; d < 5; d++) {
    const c = returnData[d] = {
      temp: 0,
      temp_max: data.list[d * 8].main.temp_max,
      temp_min: data.list[d * 8].main.temp_min,
      humidity: 0,
      weather: []
    }
    for (let h = 0; h < 8; h++) {
      // ch - current hour
      const ch = data.list[d * 8 + h]

      c.temp += ch.main.temp
      c.temp_max = ch.main.temp_max > c.temp_max ? ch.main.temp_max : c.temp_max
      c.temp_min = ch.main.temp_min < c.temp_min ? ch.main.temp_min : c.temp_min
      c.humidity += ch.main.humidity
      c.weather[h] = {
        main: ch.weather[0].main,
        icon: ch.weather[0].icon.slice(0, -1)
      }
    }
    c.temp = Math.round(c.temp / 8)
    c.humidity = Math.round(c.humidity / 8)
    c.temp_max = Math.round(c.temp_max)
    c.temp_min = Math.round(c.temp_min)
    c.weather = getMostFrequent(c.weather)
  }
  return returnData
}

let isQueryRunning = false

// get city data on textbox submit
document.getElementById('city-search').addEventListener('submit', e => {
  e.preventDefault()
  if (!isQueryRunning) {
    isQueryRunning = true
    e.target.style.pointerEvents = 'none'
    e.target.query.disabled = ' '

    if (e.target.query.value.trim().length > 0) {
      getWeather(e.target.query.value)
        .then(data => {
          // if response ok
          if (data.cod && data.cod === '200') {
            // TODO getAverageTemp(data) - wyrenderowac
            console.log(getAverageData(data))

            e.target.query.value = ''
          }
        })
        .catch(rej => console.log(rej))
        .finally(() => {
          isQueryRunning = false
          e.target.style.pointerEvents = 'auto'
          e.target.query.disabled = ''
        })
    }
  }
})

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
const getForecast = data => {
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


// The function responsible for displaying today's date and days of the week in the right places on the page.
const getDate = () =>{
    //Display today's date (Format DD.MM.YYYY)
    let time = Date.now()
    let date = new Date(time);
    let today = date.getDate() + '.' + (date.getMonth()+1)+'.'+date.getFullYear();
    document.getElementById('date').innerText = today;

    //Display days of the week
    let week= ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
    let weekShort = ['Ndz','Pon','Wt','Śr','Czw','Pt','Sob'];

    let fiveWeekdaysNames = document.getElementsByClassName('day-of-the-week');
        fiveWeekdaysNames[0].innerText = week[date.getDay()].toUpperCase();
    for(let i = 1 ; i< fiveWeekdaysNames.length ; i++){
        fiveWeekdaysNames[i].innerText =  weekShort[date.getDay()+i].toUpperCase();
    }
}

// The function responsible for displaying temperatures,icons and humidity in the right places on the page.
function renderData(avr,allData){

    // Display the city name and temperatures for all days
    document.getElementById('current-city-name').innerText = allData.city.name.toUpperCase() + ',   '+ allData.city.country;
    document.getElementById('temp').innerHTML = avr[0].temp.toString()+'<span>&deg;C</span>';
    document.getElementById('day2').innerHTML = avr[1].temp.toString()+'<span>&deg;C</span>';
    document.getElementById('day3').innerHTML = avr[2].temp.toString()+'<span>&deg;C</span>';
    document.getElementById('day4').innerHTML = avr[3].temp.toString()+'<span>&deg;C</span>';
    document.getElementById('day5').innerHTML = avr[4].temp.toString()+'<span>&deg;C</span>';

    // Loop the loop through which we will display appropriate icons. Icons depend on the weather. Icons come from FontAwesome
    for (let i = 0 ; i < avr.length ; i++){
        let x = document.getElementsByClassName('icon')[i];
        x.className = "";
        switch(avr[i].weather.icon.toString()) {
            case '01':
                x.classList.add("icon","fa-sun","fas");               //sun
                break;
            case '02':
                x.classList.add("icon","fa-cloud-sun","fas");         //few clouds
                break;
            case '03':
                x.classList.add("icon","fa-cloud","fas");             //scattered clouds
                break;
            case '04':
                x.classList.add("icon","fa-cloud","fas");             //broken clouds
                break;
            case '09':
                x.classList.add("icon","fa-cloud-rain","fas");        //shower rain
                break;
            case '10':
                x.classList.add("icon","fa-cloud-sun-rain","fas");    //rain
                break;
            case '11':
                x.classList.add("icon","fa-bolt","fas");              //thunderstorm
                break;
            case '13':
                x.classList.add("icon","fa-snowflake","fas");         //snow
                break;
            case '50':
                x.classList.add("icon","fa-smog","fas");              //mist
                break;
            }
    }

    //Display maximum and minimum temperature in first day and the humidity.
    document.getElementById('max').innerHTML = 'Max:<br>' + avr[0].temp_max +'<span>&deg;C</span>';
    document.getElementById('min').innerHTML = 'Min:<br> ' + avr[0].temp_min +'<span>&deg;C</span>';
    document.getElementById('humidity').innerText = 'Wilgotność:' + "\r\n" + avr[0].humidity + '%';
}

let isQueryRunning = false
// get city data on textbox submit
document.getElementById('city-search').addEventListener('submit', e => {
  e.preventDefault()
  if (!isQueryRunning && e.target.query.value.trim().length > 0) {
    isQueryRunning = true
    e.target.style.pointerEvents = 'none'
    e.target.query.disabled = ' '

    getWeather(e.target.query.value)
      .then(data => {
        // if response ok
        if (data.cod && data.cod === '200') {
          let dataAvarage = getForecast(data);
          renderData(dataAvarage,data);
          getDate();
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
)

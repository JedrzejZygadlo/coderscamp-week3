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

// get average data for 5 days
const getForecast = data => {
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
function renderData(allData){
    let avr = getForecast(allData);
    // Display the city name and temperatures for all days
    let cityName = document.getElementById('current-city-name');
    cityName.innerText = allData.city.name.toUpperCase() + ',   '+ allData.city.country;
    let iconElement = document.createElement("i");
    iconElement.setAttribute("class","far fa-plus-square plus addremove");
    iconElement.addEventListener('click',plusOnClick,false);
    cityName.appendChild(iconElement);
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
    setVideoBg(avr)
}

const setVideoBg = avg => {
  let weather = ''

  switch (avg[0].weather.icon) {
    case '01':
    case '02':
    case '50':
      weather = 'sun'
      break
    case '03':
    case '04':
      weather = 'cloud'
      break
    case '09':
    case '10':
    case '11':
      weather = 'rain'
      break
    case '13':
      weather = 'snow'
      break
  }
  if (document.querySelector('#videoBg > video').getAttribute('src') !== `vid/${weather}.mp4`) {
    document.querySelector('#videoBg > video').src = `vid/${weather}.mp4`
  }
}

let isQueryRunning = false
const sendQuery = cityName => {
  if (!isQueryRunning && cityName.trim().length > 0) {
    isQueryRunning = true
    // set the form pointerEvents to none, so it can't be accessed by pointing device
    document.getElementById('city-search').style.pointerEvents = 'none'
    // set the query input to disabled, so it can't be manipulated
    document.getElementById('cityNameInput').disabled = ' '

    getWeather(cityName)
      .then(data => {
        // if response ok
        if (data.cod && data.cod === '200') {
          renderData(data);
          getDate();
          window.localStorage.currentCity = cityName
        }
      })
      .catch(rej => console.error(rej))
      .finally(() => {
        isQueryRunning = false
        // clear query input
        document.getElementById('cityNameInput').value = ''
        // enable query input
        document.getElementById('cityNameInput').disabled = ''
        // make the form accessible again
        document.getElementById('city-search').style.pointerEvents = 'auto'
      })
  }
}

// get city data on textbox submit
document.getElementById('city-search').addEventListener('submit', e => {
  e.preventDefault()
  sendQuery(e.target.query.value.trim())
})

const getLocalStorageArray = () => {
  return localStorage.getItem('favourites') ? JSON.parse(localStorage.getItem('favourites')) : [];
}

const writeArrayToLocalStorage = (favouritesArray) => {
  localStorage.setItem('favourites', JSON.stringify(favouritesArray));
}


const minusOnClick = (e) => {
  e.stopPropagation();
  let target = e.target;
  let parent = target.parentElement;
  let parentText = parent.innerText;
  let localStorageArray = getLocalStorageArray();
  localStorageArray.splice(localStorageArray.indexOf(parentText),1);
  writeArrayToLocalStorage(localStorageArray);
  loadFavourites();
}


const loadFavourites = () =>{
    localStorageArray = getLocalStorageArray();
    let rightContainer = document.getElementById("right-container")
    // console.log(rightContainer.innerText);
    while(rightContainer.firstChild){
      rightContainer.removeChild(rightContainer.firstChild);
    }
    

    for(let index = 0;index<localStorageArray.length;index++){
        let newFavourite = document.createElement("span");
        newFavourite.classList.add('favourite');
        newFavourite.innerText = localStorageArray[index];
        newFavourite.addEventListener('click', e => sendQuery(e.target.innerText), false);

        let iconElement = document.createElement("i");
        iconElement.setAttribute("class","far fa-minus-square minus addremove");
        iconElement.addEventListener('click',minusOnClick,false);

        newFavourite.appendChild(iconElement);
        rightContainer.appendChild(newFavourite);
    }
    // console.log(localStorageArray);
  }

loadFavourites();


const plusOnClick = (e) =>{
        let target = e.target;
        let parent = target.parentElement;
        let parentText = parent.innerText;
        let localStorageArray = getLocalStorageArray();
        if(localStorageArray.indexOf(parentText) == -1){
          localStorageArray.push(parentText);
          writeArrayToLocalStorage(localStorageArray);
        }
        else{
          alert("Already saved in favourites list");
        } 
        loadFavourites(); 
}

//Iterates through array in case in future version there will be more plus icons saving to local storage
let plusArray = document.querySelectorAll(".plus");
for(let index = 0;index<plusArray.length;index++){
  plusArray[index].addEventListener('click',plusOnClick,false);
}

// if there's no "current city", set a default
if (window.localStorage.currentCity === undefined) {
  window.localStorage.currentCity = 'Wroclaw, PL'
}
// initial view
sendQuery(window.localStorage.currentCity)

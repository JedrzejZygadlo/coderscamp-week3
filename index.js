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
            console.log(getForecast(data))

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
<<<<<<< HEAD
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

writeArrayToLocalStorage(["Częstochowa, PL","Berlin, DE","New York, US"]); // Test Aray to test functionality delete in final version

const loadFavourites = () =>{
    localStorageArray = getLocalStorageArray();
    let rightContainer = document.getElementById("right-container")
    
    while(rightContainer.firstChild){
      rightContainer.removeChild(rightContainer.firstChild);
    }

    for(let index = 0;index<localStorageArray.length;index++){
        let newFavourite = document.createElement("span");
        newFavourite.classList.add('favourite');
        newFavourite.innerText = localStorageArray[index];
        newFavourite.addEventListener('click',()=>{renderData(newFavourite.innerText)},false);

        let iconElement = document.createElement("i");
        iconElement.setAttribute("class","far fa-minus-square minus addremove");
        iconElement.addEventListener('click',minusOnClick,false);

        newFavourite.appendChild(iconElement);
        rightContainer.appendChild(newFavourite);
    }
    console.log(localStorageArray);
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

//Will be replaced by real render function that takes cityName as argument
const renderData = (cityName) => {
  console.log("Data rendered for: " + cityName);
}
=======
  }
})
>>>>>>> 81a098c572ddb4b9f408ac3f62db18ab7b611fe0

const getWeather = async (cityName) => {
  url = new URL(`https://api.openweathermap.org/data/2.5/forecast`)
  url.search = new URLSearchParams({
    appid: '463692f6a5af1bbd9009033cd6ccfe95',
    q: cityName,
    units: 'metric'
  })

  return await fetch(url)
    .then(res => res.json())
    .catch(e => e)
}

// get average temperature for 5 days
const getAverageTemp = (data) => {
  const returnData = []
  for(let d = 0; d < 5; d++) {
    let avg = 0;
    for(let h = 0; h < 8; h++) {
      avg += data.list[d * 8 + h].main.temp
    }
    returnData.push(Math.round(avg / 8))
  }
  return returnData
}


document.body.addEventListener('submit', function(e){
    if(e.target && e.target.matches('#city-search')) {
      e.preventDefault();
      getWeather(e.target.query.value)
      .then(data => {
        // if no error
        if(data.cod && data.cod === "200") {
          e.target.query.value = ""
          // TODO getAverageTemp(data) - wyrenderowac
          console.log(getAverageTemp(data))
        }
      })
    }
})




if (document.body.addEventListener)
{
    document.body.addEventListener('click',yourHandler,false);
}
else
{
    document.body.attachEvent('onclick',yourHandler);//for IE
}

function yourHandler(e)
{
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (target.className.match(/plus/))
    {
        console.log("xDDD");
        var parent = target.parentElement;
        console.log(parent.innerText);
    }
}

 

const getLocalStorageArray = () => {
  let favoritesArray = localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [];
  return favoritesArray;
}

const writeArrayToLocalStorage = (favoritesArray) => {
  localStorage.setItem('favorites', JSON.stringify(favoritesArray));
}


const renderData = (cityName) => {
  //Pass
}

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

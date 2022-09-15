//variables and api calls
const oneCallApi = `https://api.openweathermap.org/data/2.5/onecall`;
var geoApi = `https://api.openweathermap.org/geo/1.0/direct`;
var lat;
var lon;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//DOM Search
var SearchForm = document.querySelector("#searchForm")
var searchText = document.querySelector("#searchText");
var searchBtn = document.querySelector(".searchBtn");
//left side elements
var currentTime = document.querySelector(".currentTime")
var dayAndDt = document.querySelector(".dayAndDt");
var greeting = document.querySelector(".greeting");


var eachCard = document.querySelector(".eachCard");
var dailyWeatherIcon = document.querySelector(".dailyWeatherIcon");
var dailyDate = document.querySelector(".dailyDt");
var dailyTemp = document.querySelector(".dailyTemp");

//right side elements
var weatherContainer = document.querySelector(".weatherContainer");
var CTName = document.querySelector(".cityName");
var todaysDate = document.querySelector(".todayDate");
var weatherIcon = document.querySelector(".weatherIcon");
var description = document.querySelector(".description");
var displayTemp = document.querySelector(".displayTemp");
var feelsLike = document.querySelector(".feelsLike");



var clouds = document.querySelector(".clouds");
var visibility = document.querySelector(".visibility")
var humidity = document.querySelector(".humid");
var UVIndex = document.querySelector(".UVIndex");
var cityHistory = document.querySelector(".searchHistory")
var sunset  = document.querySelector(".sunset");
var weatherCards = document.querySelector(".mainWeatherCards");
var snapshot = document.querySelector("#snapshot");

const apiKey = "1d4118f7e98178b78b6022957ca0f80f"

//timer that kind of works
function getTime () {
    var today = new Date ();
    var timeToday = moment();

    var hour = today.getHours();
   
    var time = timeToday.format("dddd, MMMM Do, h:mm");
    
    // conditional statement for am and pm, and greetings
    //current time before 12pm present good morning
    if (hour < 12){
        currentTime.innerHTML = time + "AM";
        greeting.textContent = "☀️ Good Morning!"
    
    } else if (hour >= 12 && hour < 18) {
        currentTime.innerHTML = time + "PM";
        greeting.textContent = " 🌞 Good Afternoon!"
    } 
    //current time is 6pm or greater, greet evening
    else {
        currentTime.innerHTML = time + "PM";
        greeting.textContent = "☽ Good Evening!"
    }

}
getTime();

setInterval(function () {
    getTime();
}, 60000)

function getLocationWeather(city) {
    
    //fetch api call
    fetch(`${geoApi}?q=${encodeURI(city)}&limit=5&appid=${apiKey}`)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function (data){
        console.log(data);
        //grabbing lat and lon from data
        lat = data[0].lat;
        lon = data[0].lon;
        //pasting the grabbed lat and lon to get weather info
        getWeatherInfo(lat, lon)
        //display city name
        CTName.textContent = "📌 " + city;
    })

} 
//default Location
getLocationWeather("Glendora")

//oneCall Fetch, boy

function getWeatherInfo (latitude, longitude){
    fetch(`${oneCallApi}?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        console.log(data);

        //date
        var UTCDate = data.current.dt;
        var locationDate = new Date(UTCDate * 1000)
        var formatedDate = days[locationDate.getDay()]; 
            todaysDate.textContent= formatedDate;

        // weather Information
        var weatherIconMain = data.current.weather[0].icon;
            weatherIcon.src =  `http://openweathermap.org/img/wn/${weatherIconMain}@2x.png`

        var weatherTemp = data.current.temp;
            displayTemp.textContent = `${Math.ceil(weatherTemp)}°`;

        var weatherFeels = data.current.feels_like;
            feelsLike.textContent = `RealFeel | ${Math.ceil(weatherFeels)}°`;

        var weatherDescription = data.current.weather[0].description;
            description.textContent = weatherDescription;

        var weatherHumid = data.current.humidity;
            humidity.textContent = `Hum | ${weatherHumid}%`;

        var weatherUV = Math.round(data.current.uvi * 10) / 10;
            UVIndex.textContent = `UV | ${weatherUV}%`;

            let output = '';
			//loop through daily forecast
			for (var d = 1; d < 7; d++) {
				var dailyDt = data.daily[d].dt;
				var dailyDtConvert = new Date(dailyDt * 1000);
				var dailyDtFormat = days[dailyDtConvert.getDay()];
				var dailyWeather = data.daily[d].temp.max;
				var dailyIcon = data.daily[d].weather[0].icon;

				output += /*html*/ `
                <div class="eachCard">
                    <div class="flex">
                        <img class="dailyWeatherIcon"  src= "http://openweathermap.org/img/wn/${dailyIcon}@2x.png"alt= "Weather Icon">
                        <div class="dailyDt">${dailyDtFormat}</div>
                        <div class="dailyTemp">${Math.ceil(dailyWeather)}°</div>
                    </div>
                </div>
            `;
			}
			$('#dailyForecast').html(output);

        let output2 = '';
            //get daily weather
            const currentDew = Math.ceil(data.current.dew_point);
            const currentWindSpeed = data.current.wind_speed;
            const currentVisibility = Math.floor(data.current.visibility / 1609); //miles convert
            const currentClouds = data.current.clouds;
            output2 = /*html*/ `
                <div class="littleCard">
                    <div class=outsideContainer>
                        <span>💧</span>
                        <div class="littleContainer">
                            <div>Dew Point</div>
                            <div class="bold">${currentDew}°</div>
                        </div>
                    </div>
                    <div class=outsideContainer>
                        <span>💨</span>
                        <div class="littleContainer">
                            <div>Wind Speed</div>
                            <div class="bold">${currentWindSpeed} mph</div>
                        </div>
                    </div>
                    <div class=outsideContainer>
                        <span>🙈</span>
                        <div class="littleContainer">
                            <div>Visibility</div>
                            <div class="bold">${currentVisibility} mi</div>
                        </div>
                    </div>
                    <div class=outsideContainer>
                        <span>☁️</span>
                        <div class="littleContainer">
                            <div>Clouds</div>
                            <div class="bold">${currentClouds}%</div>
                        </div>
                    </div>
                </div>
            `;
            $(snapshot).html(output2);

		});
}

//filter search results/save searches

function searchCity(event) {
    event.preventDefault();
    var searchValue = searchText.value.trim();
    getLocationWeather(searchValue);
    
    //add to localstorage
    var fromLocal = localStorage.getItem("city");
    var parsedValue = JSON.parse(fromLocal);
    
    var array = parsedValue || [];

    if (array.indexOf(searchValue) === -1){
        array.unshift(searchValue);
        //setting limit in localStorage
            if(array.length > 2) {
                array.pop();
            }

  
        var newValue = JSON.stringify(array);

        localStorage.setItem ("city", newValue);
    }
    displayStorage();
}

//local storage

function removeLocal(targetValue) {
    var removeHistory = JSON.parse(localStorage.getItem('city'));

    for (var i = 0; i < removeHistory.length; i++){
          if (removeHistory[i] === targetValue){
              //to remove a value from storage
              removeHistory.splice(i,1);
          };
        }
    localStorage.setItem("city",JSON.stringify(removeHistory))


}
//display  history
function displayStorage() {
    var displayHistory = JSON.parse(localStorage.getItem('city'));
    
	let output = '';
	if (displayHistory) {
		for (var i = 0; i < displayHistory.length; i++) {
			output += /*html*/ `
            <div class="searchHistory">           
                <button class="historyBtn" data-hover="⚡️" data-id="${displayHistory[i]}">${displayHistory[i]}</button>
                <button class="removeBtn" data-id="${displayHistory[i]}">⚡️</button>
            </div>
        `;
		}
		$('#displayHist').html(output);
	} else {
		console.log('No History to display');
	}
    //remove local storage
    $(".removeBtn").on("click",function(){
        var cityRemove=$(this).attr("data-id")
        removeLocal(cityRemove)
       location.reload()
    })
}

displayStorage();

var histBtn = document.getElementsByClassName('historyBtn');
for (var b = 0; b < histBtn.length; b++) {
	histBtn[b].addEventListener('click', function (event) {
		var value = event.target.getAttribute('data-id');
		getLocationWeather(value);
	});
}


searchBtn.addEventListener("click", searchCity);
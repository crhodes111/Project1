var countryArr = ['New Zealand', 'France', 'Mexico', 'USA', 'French Polynesia', 'England', 'Italy', 'Thailand', 'Japan', 'Spain', 'UAE', 'Canada', 'USA', 'Indonesia', 'Australia']
var countryIdarr = ['NZ', 'FR', 'MX', 'US', 'PF', 'GB', 'IT', 'TH', 'JP', 'ES', 'AE', 'CA', 'US', 'ID', 'AU'];
var cityArr = ['Christchurch,NZ', 'Paris,FR', 'Cancun,MX', 'San Francisco,US', 'Papeete,PF', 'London,GB', 'Rome,IT', 'Phuket,TH', 'Tokyo,JP', 'Barcelona,ES', 'Dubai,AE', 'Banff,CA', 'New York City,US', 'Bali,ID', 'Sydney,AU'];

var adviseEl = document.querySelector('#advise');
var waterEl = document.querySelector('#water');
var currencyEl = document.querySelector('#currency');
var languageEl = document.querySelector('#language');
var vaccineEl = document.querySelector('#vaccine');
var webcamEL = document.querySelector('#webcam');
var listEl = document.querySelector('#destination');
var hotelsEl = document.querySelector('#hotels');
var hotelDisplay = document.querySelector('#hotelDisplay');
var electricityEl = document.querySelector('#electricity');
var plugsEl = document.querySelector('#plugs');

if (JSON.parse(localStorage.getItem('value')) != null) {
    var savedValue = JSON.parse(localStorage.getItem('value'));
    var savedCity = JSON.parse(localStorage.getItem('city'));
    displayData(savedValue, savedCity);
}

function travelBrief (country) {
    fetch('https://travelbriefing.org/' + country + '?format=json')
        .then(function(response) {return response.json()})
        .then(function(data) {
            adviseEl.innerHTML = "<p>More travel info: <a href=\"" + data.advise.CA.url + "\">" + data.advise.CA.url + "</p>";
            
            waterEl.innerHTML = "<p>Water Quality: " + data.water.short + "</p>";
            
            currencyEl.innerHTML = "<p>Currency Code: " + data.currency.code + "</p><p>Currency: " +
            data.currency.name + "</p>";
            
            languageEl.innerHTML = "";
            if (data.language.length > 1) {
                for (i = 0; i < data.language.length; i++) {
                    
                    var p = document.createElement("p");
                    p.innerHTML = "Language " + (i+1) + ": " + data.language[i].language;
                    languageEl.appendChild(p);
                }
            } else {
                
                languageEl.innerHTML = "Language: " + data.language[0].language;
            }
            vaccineEl.innerHTML = "";
            if (data.vaccinations.length > 0) {
                for (i = 0; i < data.vaccinations.length; i++) {
                    var pV = document.createElement("p");
                    pV.innerHTML = data.vaccinations[i].name + ": " + data.vaccinations[i].message;
                    vaccineEl.appendChild(pV);
                }
            } else {
                vaccineEl.innerHTML = "No vaccinations recommended";
            }
            
            electricityEl.innerHTML = "Electrictal Voltage: " + data.electricity.voltage;

            if (data.electricity.plugs.length > 1) {
                for(i = 0; i < data.electricity.plugs.length; i++) {
                    
                    var pE = document.createElement('p');
                    pE.innerHTML = "Plug Type " + (i+1) + ": " + data.electricity.plugs[i];
                    plugsEl.appendChild(pE);
                }
            } else {
                plugsEl.innerHTML = "Plug Type: " + data.electricity.plugs[0];
            }
    })
}

function webCam (countryId) {
    fetch('https://api.windy.com/api/webcams/v2/list/country=' + countryId + '?show=webcams:location,image&key=DucimssCbEzOJVh8c8yJe1rLBHnDXfBz')
    .then(function(response) {return response.json()})
    .then(function(data) {
        
        webcamEL.innerHTML = "";
        if (data.result.webcams.length > 0) {
            var pW = document.createElement('img');
            pW.src = data.result.webcams[Math.trunc(Math.random()*data.result.webcams.length)].image.daylight.preview;
            webcamEL.appendChild(pW);
        } else {
            var pW = document.createElement('p');
            pW.innerText = "No Webcams to Display";
            webcamEL.appendChild(pW);
        }
        
    })
}

$('.destination').on('click', function (event) {
    event.preventDefault()
    var cityName = listEl.options[listEl.selectedIndex].text;
    var value = listEl.value;
    localStorage.setItem('value', JSON.stringify(value));
    localStorage.setItem('city', JSON.stringify(cityName));
    displayData(value, cityName);
})

function displayData (value, cityName) {
    
    var cityName = cityName;
    let destinationTarget = cityArr[value];

    webCam(countryIdarr[value]);
    travelBrief(countryArr[value]);
    
    const apiKey = '668cdb30df14e3d9284e2e3a36347615'

    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' +
        destinationTarget +
        '&units=imperial' +
        '&appid=' +
        apiKey
    )
        .then(function (responce) {
            return responce.json();
        })
        .then(function (data) {
            const destinationTemp = data.main.temp
            const destinationIconData = data.weather[0].icon;
            const destinationIconURL = "http://openweathermap.org/img/w/" + destinationIconData + ".png";
            const destinationWind = data.wind.speed
            const destinationHumidity = data.main.humidity

            console.log(destinationIconData);

            $('#weatherLocation').text(cityName)
            $('#weatherIcon').attr('src', destinationIconURL)
            $('#temp').text(`Temp: ${destinationTemp} ???`)
            $('#wind').text(`Wind: ${destinationWind} MPH`)
            $('#humidity').text(`Humidity: ${destinationHumidity}%`)
            
            hotelsEl.innerHTML ="";
            hotelsEl.innerHTML = "<a href=\"" + hotelUrls[value] + "\">Tripadvisor</a>";
            var url = hotelUrls[value];
            console.log(url);
            hotelDisplay.setAttribute('src', hotelUrls[value]);

            const lon = data.coord.lon
            const lat = data.coord.lat

            fetch(
                'https://api.openweathermap.org/data/2.5/onecall?lat='+
                lat +
                '&lon=' +
                lon +
                '&appid='+
                apiKey
            )
            .then(function(responce){
                return responce.json();
            })
            .then(function(data){
                const destinationUV = data.current.uvi
                
                if (destinationUV < 4) {
                    $('#uvIndex').addClass('label success')
                }else if (destinationUV > 5 && destinationUV < 8) {
                    $('#uvIndex').addClass('label warning')
                } else {
                    $('#uvIndex').addClass('label alert')
                }

                $('#uvIndex').text(`UV Index: ${destinationUV}`)
                
            })
        })
}

var hotelUrls = ["https://www.tripadvisor.com/SmartDeals-g255116-South_Island-Hotel-Deals.html",
 "https://www.tripadvisor.com/Hotels-g187147-Paris_Ile_de_France-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g150807-Cancun_Yucatan_Peninsula-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g60713-San_Francisco_California-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g309679-Tahiti_Society_Islands-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g186338-London_England-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g187791-Rome_Lazio-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g293920-Phuket-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g298184-Tokyo_Tokyo_Prefecture_Kanto-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g187497-Barcelona_Catalonia-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g295424-Dubai_Emirate_of_Dubai-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g154911-Banff_Banff_National_Park_Alberta-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g60763-New_York_City_New_York-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g294226-Bali-Hotels.html",
 "https://www.tripadvisor.com/Hotels-g255060-Sydney_New_South_Wales-Hotels.html"];

 
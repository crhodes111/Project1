var country = "Japan";
var countryId = 'JP';
var amadeusApi = 'v2VHGvDzvKkUDZ4dYmrvGtgXbIryxVoC';
var amadeusSecret = 'BXi2TubLGNGhXqEC';

var adviseEl = document.querySelector('#advise');
var waterEl = document.querySelector('#water');
var currencyEl = document.querySelector('#currency');
var languageEl = document.querySelector('#language');
var vaccineEl = document.querySelector('#vaccine');
var webcamEL = document.querySelector('#webcam');

travelBrief(country);

function travelBrief (country) {
    fetch('https://travelbriefing.org/' + country + '?format=json')
        .then(function(response) {return response.json()})
        .then(function(data) {
            //console.log(data);
            //console.log("More travel info: " + data.advise.CA.url);
            adviseEl.innerHTML = "<p>More travel info: <a href=\"" + data.advise.CA.url + "\">" + data.advise.CA.url + "</p>";
            //console.log("Drinking water safety: " + data.water.short);
            waterEl.innerHTML = "<p>Water Quality: " + data.water.short + "</p>";
            //console.log("Currency code: " + data.currency.code);
            currencyEl.innerHTML = "<p>Currency Code: " + data.currency.code + "</p><p>Currency: " +
            data.currency.name + "</p>";
            //console.log("Currency: " + data.currency.name);
            languageEl.innerHTML = "";
            if (data.language.length > 1) {
                for (i = 0; i < data.language.length; i++) {
                    //console.log("Language " + (i+1) + ": " + data.language[i].language);
                    var p = document.createElement("p");
                    p.innerHTML = "Language " + (i+1) + ": " + data.language[i].language;
                    languageEl.appendChild(p);
                }
            } else {
                //console.log(data.language[0].language);
                languageEl.innerHTML = "Language: " + data.language[0].language;
            }
            vaccineEl.innerHTML = "";
            if (data.vaccinations.length > 0) {
                for (i = 0; i < data.vaccinations.length; i++) {
                    //console.log(data.vaccinations[i].name + ": " + data.vaccinations[i].message);
                    var pV = document.createElement("p");
                    pV.innerHTML = data.vaccinations[i].name + ": " + data.vaccinations[i].message;
                    vaccineEl.appendChild(pV);
                }
            } else {
                //console.log("No vaccinations recommended");
                vaccineEl.innerHTML = "No vaccinations recommended";
            }
            
    })
}

webCam();

function webCam () {
    fetch('https://api.windy.com/api/webcams/v2/list/country=' + countryId + '?show=webcams:location,image&key=DucimssCbEzOJVh8c8yJe1rLBHnDXfBz')
    .then(function(response) {return response.json()})
    .then(function(data) {
        //console.log(data.result.webcams[Math.trunc(Math.random()*data.result.webcams.length)].image.daylight.preview);
        var pW = document.createElement('img');
        pW.src = data.result.webcams[Math.trunc(Math.random()*data.result.webcams.length)].image.daylight.preview;
        webcamEL.appendChild(pW);
    })
}

$('.destination').on('click', function (event) {
    event.preventDefault()

    //let destinationTarget = event.target.innerHTML
    let destinationTarget = 'Tokyo,Japan';
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

            $('#weatherLocation').text(destinationTarget)
            $('#weatherIcon').attr('src', destinationIconURL)
            $('#temp').text(`Temp: ${destinationTemp} ℉`)
            $('#wind').text(`Wind: ${destinationWind} MPH`)
            $('#humidity').text(`Humidity: ${destinationHumidity}%`)

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
})
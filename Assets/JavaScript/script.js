var country = "England";

travelBrief(country);

function travelBrief (country) {
    fetch('https://travelbriefing.org/' + country + '?format=json')
        .then(function(response) {return response.json()})
        .then(function(data) {
            console.log(data);
            console.log("More travel info: " + data.advise.CA.url);
            console.log("Drinking water safety: " + data.water.short);
            console.log("Currency code: " + data.currency.code);
            console.log("Currency: " + data.currency.name);
            if (data.language.length > 1) {
                for (i = 0; i < data.language.length; i++) {
                    console.log("Language " + (i+1) + ": " + data.language[i].language);
                }
            } else {
                console.log(data.language[0].language);
            }
            
            if (data.vaccinations.length > 0) {
                for (i = 0; i < data.vaccinations.length; i++) {
                    console.log(data.vaccinations[i].name + ": " + data.vaccinations[i].message);
                }
            } else {
                console.log("No vaccinations recommended");
            }
            
    })
}

// webCam()

function webCam () {
    fetch('https://api.windy.com/api/webcams/v2/list/country=IT?show=webcams:location,image&key=DucimssCbEzOJVh8c8yJe1rLBHnDXfBz')
        .then(function(response) {return response.json()})
        .then(function(data) {
            console.log(data);
    })
}

var map = L.map('map').setView([0, 0], 1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    noWrap: true // This line prevents the map from wrapping around horizontally.
}).addTo(map);

// Placeholder data for countries
var countryData = {
    "USA": { population: 330000000, lifeExpectancy: 78 },
    "Canada": { population: 38000000, lifeExpectancy: 82 },
    "Mexico": { population: 128000000, lifeExpectancy: 75 }
};

function onCountryClick(feature) {
    var dataDiv = document.getElementById('data');
    var countryName = feature.properties.name;
    if (countryData[countryName]) {
        dataDiv.innerHTML = '<h2>' + countryName + '</h2>' +
                            '<p>Population: ' + countryData[countryName].population + '</p>' +
                            '<p>Life Expectancy: ' + countryData[countryName].lifeExpectancy + '</p>';
    } else {
        dataDiv.innerHTML = '<p>No data available for ' + countryName + '</p>';
    }
}

function style(feature) {
    return {
        fillColor: 'green',
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: function(e) {
            zoomToFeature(e);
            onCountryClick(feature);
        }
    });
}

var geojson = L.geoJson(null, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

fetch("countries.geojson")
    .then(response => response.json())
    .then(data => {
        geojson.addData(data);
    });


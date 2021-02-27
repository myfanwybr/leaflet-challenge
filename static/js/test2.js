var mymap = L.map('mapid').setView([33.7218, -100.6661], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

// Store our API endpoint inside queryUrl
var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"


d3.json(url, function(data){
    
    console.log(data)
    var feature=data.features

    function getColor(d) {
        return d >90 ? '#d53e4f' :
               d >70  ? '#fc8d59' :
               d >50  ? '#fee08b' :
               d >30  ? '#e6f598' :
               d >10   ? '#99d594' :
               d > -10   ? '#3288bd' :
               '#FFEDA0';
    }

    feature.forEach(element=> {
        var coordinates= element.geometry.coordinates
        var magnitude= element.properties.mag
        console.log([coordinates[2]])

        L.circle([coordinates[1], coordinates[0]], {
            color: getColor(coordinates[2]),
            // fillColor: "blue",
            // // Adjust radius
            radius: magnitude* 20000
            }).bindPopup("<h1>" + element.properties.place + "</h1> <hr> <h3>Magnitude: " + magnitude + "</h3> <h3>Depth: " + coordinates[2] + "</h3> <h3>Date: "
            + new Date(element.properties.time) + "</h3").addTo(mymap)

    
    })  
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90, 10000],
            labels = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(mymap);
})

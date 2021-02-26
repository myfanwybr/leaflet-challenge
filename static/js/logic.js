var mymap = L.map('mapid').setView([33.7218, -100.6661], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data){
    
    console.log(data)
    var feature=data.features

    function getColor(d) {
        return d >= -10 <10 ? '#d53e4f' :
               d >= 10 <30  ? '#fc8d59' :
               d >=30<50  ? '#fee08b' :
               d >= 50<70  ? '#e6f598' :
               d >= 70<90   ? '#99d594' :
               d >= 90   ? '#3288bd' :
               '#FFEDA0';
    }

    feature.forEach(element=> {
        var coordinates= element.geometry.coordinates
        var magnitude= element.properties.mag
        // console.log([coordinates[0], coordinates[1]])

        L.circle([coordinates[1], coordinates[0]], {
            color: getColor(coordinates[2]),
            // fillColor: "blue",
            // // Adjust radius
            radius: magnitude* 15000
            }).addTo(mymap)
    
    })    

})



var state
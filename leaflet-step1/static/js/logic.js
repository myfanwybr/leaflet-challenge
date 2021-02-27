var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"
d3.json(url, function(data){
    console.log(data)})

d3.json(url, function(data){
    createFeatures(data.features)
});

 function getColor(d) {
        return d >90 ? '#d53e4f' :
               d >70  ? '#fc8d59' :
               d >50  ? '#fee08b' :
               d >30  ? '#e6f598' :
               d >10   ? '#99d594' :
               d > -10   ? '#3288bd' :
               '#FFEDA0';
    }

function createFeatures(earthquakeData){
   
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            var geojsonMarkerOptions = {
                radius: feature.properties.mag*20000,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
        
                return L.circle(latlng, geojsonMarkerOptions).bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h3>Magnitude: " + feature.properties.mag + "</h3> <h3>Depth: " +
                feature.geometry.coordinates[2] + "</h3> <h3>Time: "
                + new Date(feature.properties.time) + "</h3");    
            }  
    })
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

    var overlayMaps = {
        Earthquakes: earthquakes
      };

      var myMap = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
      });
      
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = ['-10-10','10-30','30-50','50-70','70-90','90+'];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) +'"></i>' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Earthquakes Magnitude 1.0+ last 7 days</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
            : 'Click a bubble');
    };
    info.addTo(myMap)
    
}  
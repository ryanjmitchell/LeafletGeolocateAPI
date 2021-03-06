window.onload = function(){
	alert('If you give it permission, this web page will access to your location in order to demonstrate how device sensors can interact with web maps.');
}

var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicnlhbmptaXRjaCIsImEiOiJjamhhdDBjaXgwcmZlMzBxZ2t1cnZ4bnFnIn0.4tXv0Yvk06rDbYp7ZLSdAw';

var light   = L.tileLayer(mbUrl, {id: 'mapbox.light', maxZoom:18, attribution: mbAttr}),
dark  = L.tileLayer(mbUrl, {id: 'mapbox.dark', maxZoom:18, attribution: mbAttr});

var map = L.map('map', {
	layers:[light]}).fitWorld();

var baseLayers = {
	"light": light,
	"dark": dark
};
L.control.layers(baseLayers).addTo(map);

L.easyButton('fas fa-crosshairs', function(btn, map){
	map.locate({setView: true, maxZoom: 18});
}).addTo(map);

var currentTime = new Date().getHours()

if (7 <= currentTime && currentTime < 19){
	map.removeLayer(dark);
	map.addLayer(light);
}
else{
	map.removeLayer(light);
	map.addLayer(dark);
}

function onLocationFound(e) {

	var radius = e.accuracy / 2;

	var latlong = e.latlng

	L.marker(e.latlng).addTo(map)
	.bindPopup("You are within " + radius + "m of this point.<br>Latitude: " + e.latitude + "<br>Longitude: " + e.longitude).openPopup();

	L.circle(e.latlng, radius).addTo(map);

	if (radius < 30) {
		L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
	}
	else{
		L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
	}
}

function onLocationError(e) {
	alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//This specifies that the locate method should run
map.locate({
  setView: true, //this option centers the map on location and zooms
  maxZoom: 16, // this option prevents the map from zooming further than 16, maintaining some spatial context even if the accuracy of the location reading allows for closer zoom
  timeout: 15000, // Changed this to 15000.
  watch: false, // you can set this option from false to true to track a user's movement over time instead of just once. For our purposes, however, leave this option as is.
});

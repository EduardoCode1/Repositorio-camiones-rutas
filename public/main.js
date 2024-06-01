document.addEventListener('DOMContentLoaded', function() {
  var mapa = new mapboxgl.Map({
    container: 'mapa',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-88.89653, 13.794185], // Coordenadas del centro de El Salvador
    zoom: 9
  });

  window.registrarVehiculo = function() {
    var idVehiculo = document.getElementById('id-vehiculo').value;
    var status = document.getElementById('status').value;
    var pointAAddress = document.getElementById('pointA-address').value;
    var pointBAddress = document.getElementById('pointB-address').value;
    var fuelLevel = document.getElementById('fuel-level').value;
    var avgSpeed = document.getElementById('avg-speed').value;
    var totalKm = document.getElementById('total-km').value;

    axios.post('/vehicles', {
      id: idVehiculo,
      status: status,
      pointAAddress: pointAAddress,
      pointBAddress: pointBAddress,
      fuelLevel: fuelLevel,
      avgSpeed: avgSpeed,
      totalKm: totalKm
    })
    .then(function(response) {
      var vehicle = response.data.vehicle;
      console.log('Vehículo registrado:', vehicle);

      // Agregar marcadores y ruta al mapa
      var coords = [
        [vehicle.pointA.longitude, vehicle.pointA.latitude],
        [vehicle.pointB.longitude, vehicle.pointB.latitude]
      ];

      var bounds = coords.reduce(function(bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coords[0], coords[0]));

      mapa.fitBounds(bounds, {
        padding: 20
      });

      // Agregar la capa de ruta al mapa
      mapa.addLayer({
        id: 'route-' + vehicle.id,
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#007bff',
          'line-width': 6
        }
      });

      // Agregar marcadores
      new mapboxgl.Marker()
        .setLngLat([vehicle.pointA.longitude, vehicle.pointA.latitude])
        .addTo(mapa);

      new mapboxgl.Marker()
        .setLngLat([vehicle.pointB.longitude, vehicle.pointB.latitude])
        .addTo(mapa);
    })
    .catch(function(error) {
      console.error('Error al registrar vehículo:', error);
    });
  };
});

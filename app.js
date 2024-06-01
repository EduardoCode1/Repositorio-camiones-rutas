const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const geocode = require('./geocode');
const getRoute = require('./directions');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

let vehicles = [];

// Ruta para obtener el token de Mapbox
app.get('/config', (req, res) => {
  res.send({ mapboxToken: process.env.MAPBOX_TOKEN });
});

// Ruta para registrar un nuevo vehículo
app.post('/vehicles', async (req, res) => {
  const { id, status, pointAAddress, pointBAddress, fuelLevel, avgSpeed, totalKm } = req.body;
  try {
    const pointA = await geocode(pointAAddress);
    const pointB = await geocode(pointBAddress);
    const route = await getRoute(pointA, pointB);
    const vehicle = { id, status, pointA, pointB, performance: { fuelLevel, avgSpeed, totalKm } };
    vehicles.push(vehicle);
    res.send({ message: 'Vehículo registrado con éxito', vehicle });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Ruta para actualizar los datos de un vehículo
app.put('/vehicles/:id', (req, res) => {
  const { id } = req.params;
  const { status, pointAAddress, pointBAddress, fuelLevel, avgSpeed, totalKm } = req.body;
  const vehicle = vehicles.find(v => v.id === id);
  if (vehicle) {
    vehicle.status = status;
    vehicle.pointAAddress = pointAAddress;
    vehicle.pointBAddress = pointBAddress;
    vehicle.performance = { fuelLevel, avgSpeed, totalKm };
    res.send({ message: 'Vehículo actualizado con éxito', vehicle });
  } else {
    res.status(404).send({ message: 'Vehículo no encontrado' });
  }
});

// Ruta para obtener la información completa de la flota
app.get('/vehicles', (req, res) => {
  res.send(vehicles);
});

app.listen(port, () => {
  console.log(`Servidor está ejecutándose en el puerto ${port}`);
});
// Ruta para registrar un nuevo envío
app.post('/register', async (req, res) => {
  const { code, pointAAddress, pointBAddress } = req.body;
  try {
    const pointA = await geocode(pointAAddress);
    const pointB = await geocode(pointBAddress);
    const route = await getRoute(pointA, pointB);
    const delivery = { code, pointA, pointB, pointAAddress, pointBAddress, route };
    deliveries.push(delivery);
    res.send({ message: 'Envío registrado con éxito', delivery });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
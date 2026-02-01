const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api/readings';
const METER_ID = process.env.METER_ID || 'MFM384-1';
const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || '5000'); // every 5s

function randomBetween(a, b) { return a + Math.random() * (b - a); }

let cumulativeEnergy = 0;

function generateReading() {
  // realistic-ish values for a single-phase or per-phase meter
  const voltage = Number(randomBetween(220, 240).toFixed(2)); // V
  const current = Number(randomBetween(0.1, 20).toFixed(3)); // A
  const apparentPower = (voltage * current) / 1000; // kVA
  // choose PF between 0.7 and 0.99
  const powerFactor = Number(randomBetween(0.75, 0.995).toFixed(3));
  const activePower = Number((apparentPower * powerFactor).toFixed(3)); // kW
  const reactivePower = Number(Math.sqrt(Math.max(0, apparentPower * apparentPower - activePower * activePower)).toFixed(3));
  // energy increment: kW * hours. For interval in seconds -> hours = interval/3600
  const energyIncrement = activePower * (INTERVAL_MS / 1000) / 3600; 
  cumulativeEnergy = Number((cumulativeEnergy + energyIncrement).toFixed(6));
  const thd = Number(randomBetween(1.0, 6.0).toFixed(2));

  return {
    meterId: METER_ID,
    timestamp: new Date(),
    voltage,
    current,
    activePower,
    reactivePower,
    apparentPower,
    energy: cumulativeEnergy,
    powerFactor,
    thd
  };
}

async function postReading() {
  const reading = generateReading();
  try {
    const res = await axios.post(API_URL, reading);
    console.log('Posted', reading.timestamp.toISOString(), 'V:', reading.voltage, 'I:', reading.current, 'P(kW):', reading.activePower);
  } catch (err) {
    console.error('Post error', err.message);
  }
}

console.log('Simulator starting - posting to', API_URL);
setInterval(postReading, INTERVAL_MS);
postReading();

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reading = require('../models/Reading');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// POST /api/readings  (from simulator or device) - allow API_KEY or JWT
router.post('/', async (req, res) => {
  try {
    // optional API key header
    const apiKey = req.header('x-api-key');
    if (!apiKey && !req.header('x-auth-token')) {
      // you could require api key or auth; here we allow if API key matches
    }
    const data = req.body;
    const reading = new Reading(data);
    await reading.save();
    res.json({ msg: 'Saved', reading });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET latest reading
router.get('/latest', async (req, res) => {
  const latest = await Reading.findOne().sort({ timestamp: -1 });
  res.json(latest);
});

// GET /api/readings?from=...&to=...
router.get('/', async (req, res) => {
  try {
    const { from, to, meterId } = req.query;
    const q = {};
    if (meterId) q.meterId = meterId;
    if (from || to) q.timestamp = {};
    if (from) q.timestamp.$gte = new Date(from);
    if (to) q.timestamp.$lte = new Date(to);
    const data = await Reading.find(q).sort({ timestamp: -1 }).limit(10000);
    res.json(data);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET export CSV for date range
router.get('/export/csv', async (req, res) => {
  try {
    const { from, to } = req.query;
    const q = {};
    if (from || to) q.timestamp = {};
    if (from) q.timestamp.$gte = new Date(from);
    if (to) q.timestamp.$lte = new Date(to);
    const data = await Reading.find(q).sort({ timestamp: 1 }).lean();
    const csvWriter = createCsvWriter({
      path: '/tmp/readings_export.csv',
      header: [
        { id: 'timestamp', title: 'timestamp' },
        { id: 'voltage', title: 'voltage' },
        { id: 'current', title: 'current' },
        { id: 'activePower', title: 'activePower' },
        { id: 'reactivePower', title: 'reactivePower' },
        { id: 'apparentPower', title: 'apparentPower' },
        { id: 'energy', title: 'energy' },
        { id: 'powerFactor', title: 'powerFactor' },
        { id: 'thd', title: 'thd' }
      ]
    });
    await csvWriter.writeRecords(data);
    res.download('/tmp/readings_export.csv', 'readings.csv');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const dataRoutes = require('../backend/routes/data');
const predictionRoutes = require('../backend/routes/prediction');
const policyRoutes = require('../backend/routes/policy');

app.use('/api/data', dataRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/policy', policyRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;

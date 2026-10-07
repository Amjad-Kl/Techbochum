const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Standard-Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Statische Dateien für das Frontend ausliefern
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose-Verbindung (optional mit Fallback)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mapforall';

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 2500 // Schneller Fallback ohne langes Warten
})
.then(() => {
    console.log('✓ MongoDB erfolgreich verbunden');
})
.catch(() => {
    console.log('ℹ Hinweis: MongoDB nicht erreichbar. Lokaler Datei-Speichermodus (JSON) ist aktiv.');
});

// API-Endpunkte
app.use('/api/reports', require('./routes/reports'));

// Systemstatus
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'MapForAll Backend',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'local-storage-fallback',
        timestamp: new Date().toISOString()
    });
});

// SPA Fallback für nicht-API Routen
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = parseInt(process.env.PORT, 10) || 5000;
app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(` MapForAll Server läuft erfolgreich!`);
    console.log(` Web-App: http://localhost:${PORT}`);
    console.log(` API:     http://localhost:${PORT}/api/reports`);
    console.log(`--------------------------------------------------`);
});
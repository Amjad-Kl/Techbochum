const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Report = require('../models/Report');

const LOCAL_STORAGE_FILE = path.join(__dirname, '..', 'data', 'reports.json');

// Hilfsfunktion: Lokale Berichte aus Datei laden
function getLocalReports() {
    try {
        if (!fs.existsSync(LOCAL_STORAGE_FILE)) {
            // Beispieldaten initial anlegen
            const initialData = [
                {
                    _id: 'sample-1',
                    location: 'Kortumstraße 45, Bochum',
                    barrierType: 'stairs',
                    severity: 'high',
                    description: 'Drei Stufen am Haupteingang ohne rollstuhlgerechte Rampe.',
                    status: 'pending',
                    lat: 51.4802,
                    lng: 7.2188,
                    photo: null,
                    createdAt: new Date().toISOString()
                },
                {
                    _id: 'sample-2',
                    location: 'U-Bahn Rathaus Süd, Bochum',
                    barrierType: 'elevator',
                    severity: 'high',
                    description: 'Aufzug zu Gleis 2 defekt, Techniker bereits verständigt.',
                    status: 'verified',
                    lat: 51.4828,
                    lng: 7.2152,
                    photo: null,
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                }
            ];
            fs.mkdirSync(path.dirname(LOCAL_STORAGE_FILE), { recursive: true });
            fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
            return initialData;
        }
        const data = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Fehler beim Lesen der lokalen Berichte:', err.message);
        return [];
    }
}

// Hilfsfunktion: Lokale Berichte speichern
function saveLocalReports(reports) {
    try {
        fs.mkdirSync(path.dirname(LOCAL_STORAGE_FILE), { recursive: true });
        fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(reports, null, 2), 'utf-8');
    } catch (err) {
        console.error('Fehler beim Speichern der lokalen Berichte:', err.message);
    }
}

// GET: Alle Meldungen abrufen
router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const reports = await Report.find().sort({ createdAt: -1 });
            return res.json(reports);
        } else {
            const reports = getLocalReports();
            return res.json(reports);
        }
    } catch (error) {
        console.error('GET /api/reports Fehler:', error);
        // Fallback auf lokale Daten bei Datenbankfehler
        const reports = getLocalReports();
        return res.json(reports);
    }
});

// POST: Neue Meldung anlegen
router.post('/', async (req, res) => {
    try {
        const { location, barrierType, description, severity, status, lat, lng, photo } = req.body;

        if (!location || !barrierType || !description) {
            return res.status(400).json({
                message: 'Pflichtfelder fehlen (Ort, Art der Barriere und Beschreibung erforderlich).'
            });
        }

        // Koordinaten bestimmen
        let finalLat = parseFloat(lat);
        let finalLng = parseFloat(lng);

        if (isNaN(finalLat) || isNaN(finalLng)) {
            // Geocode-Fallback für bekannte Städte
            const knownCoords = {
                'bochum': { lat: 51.4818, lng: 7.2162 },
                'dortmund': { lat: 51.5136, lng: 7.4653 },
                'essen': { lat: 51.4556, lng: 7.0116 },
                'herne': { lat: 51.5381, lng: 7.2256 }
            };

            const locLower = location.toLowerCase();
            let matched = false;
            for (const [city, coords] of Object.entries(knownCoords)) {
                if (locLower.includes(city)) {
                    finalLat = coords.lat + (Math.random() - 0.5) * 0.02;
                    finalLng = coords.lng + (Math.random() - 0.5) * 0.02;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                // Bochum Innenstadt als Standard
                finalLat = 51.4818 + (Math.random() - 0.5) * 0.02;
                finalLng = 7.2162 + (Math.random() - 0.5) * 0.02;
            }
        }

        const reportData = {
            location: location.trim(),
            barrierType,
            description: description.trim(),
            severity: severity || 'medium',
            status: status || 'pending',
            lat: finalLat,
            lng: finalLng,
            photo: photo || null,
            createdAt: new Date()
        };

        if (mongoose.connection.readyState === 1) {
            const report = new Report(reportData);
            const saved = await report.save();
            return res.status(201).json(saved);
        } else {
            // Lokale Datei
            const localReports = getLocalReports();
            const newLocalReport = {
                _id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                ...reportData
            };
            localReports.unshift(newLocalReport);
            saveLocalReports(localReports);
            return res.status(201).json(newLocalReport);
        }
    } catch (error) {
        console.error('POST /api/reports Fehler:', error);
        res.status(500).json({ message: 'Interner Serverfehler: ' + error.message });
    }
});

// PATCH: Status oder Details aktualisieren
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (mongoose.connection.readyState === 1) {
            const report = await Report.findById(id);
            if (!report) {
                return res.status(404).json({ message: 'Meldung nicht gefunden.' });
            }

            if (updates.status) report.status = updates.status;
            if (updates.description) report.description = updates.description;
            if (updates.barrierType) report.barrierType = updates.barrierType;
            if (updates.severity) report.severity = updates.severity;

            const saved = await report.save();
            return res.json(saved);
        } else {
            const localReports = getLocalReports();
            const index = localReports.findIndex(r => r._id === id || r.id === id);
            if (index === -1) {
                return res.status(404).json({ message: 'Meldung nicht gefunden.' });
            }

            localReports[index] = {
                ...localReports[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            saveLocalReports(localReports);
            return res.json(localReports[index]);
        }
    } catch (error) {
        console.error('PATCH /api/reports/:id Fehler:', error);
        res.status(500).json({ message: 'Fehler beim Aktualisieren: ' + error.message });
    }
});

// DELETE: Meldung löschen (z. B. nach Behebung)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (mongoose.connection.readyState === 1) {
            const report = await Report.findByIdAndDelete(id);
            if (!report) {
                return res.status(404).json({ message: 'Meldung nicht gefunden.' });
            }
            return res.json({ message: 'Meldung erfolgreich gelöscht.' });
        } else {
            let localReports = getLocalReports();
            const initialLength = localReports.length;
            localReports = localReports.filter(r => r._id !== id && r.id !== id);

            if (localReports.length === initialLength) {
                return res.status(404).json({ message: 'Meldung nicht gefunden.' });
            }
            saveLocalReports(localReports);
            return res.json({ message: 'Meldung erfolgreich gelöscht.' });
        }
    } catch (error) {
        console.error('DELETE /api/reports/:id Fehler:', error);
        res.status(500).json({ message: 'Fehler beim Löschen: ' + error.message });
    }
});

module.exports = router;
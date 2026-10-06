const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Get all reports
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new report
router.post('/', async (req, res) => {
    const report = new Report({
        location: req.body.location,
        barrierType: req.body.barrierType,
        description: req.body.description,
        status: req.body.status || 'pending',
        createdAt: req.body.createdAt || new Date()
    });

    try {
        // For demo purposes, we'll use hardcoded coordinates based on the location name
        // In a real app, you would use a geocoding service like Google Maps Geocoding API
        const coordinates = {
            'Dortmund': { lat: 51.5136, lng: 7.4653 },
            'Bochum': { lat: 51.4818, lng: 7.2162 },
            'Hochschule Bochum': { lat: 51.4537, lng: 7.2507 },
            'Ruhr Universität Bochum': { lat: 51.4465, lng: 7.2628 }
        };

        // Find coordinates for the location or use default
        const locationName = req.body.location.toLowerCase();
        let lat, lng;

        for (const [key, value] of Object.entries(coordinates)) {
            if (locationName.includes(key.toLowerCase())) {
                lat = value.lat;
                lng = value.lng;
                break;
            }
        }

        // If no specific location found, use a random offset from Bochum
        if (!lat || !lng) {
            lat = 51.4818 + (Math.random() - 0.5) * 0.1;
            lng = 7.2162 + (Math.random() - 0.5) * 0.1;
        }

        report.lat = lat;
        report.lng = lng;

        const newReport = await report.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a report
router.patch('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (req.body.status) report.status = req.body.status;
        if (req.body.description) report.description = req.body.description;
        if (req.body.barrierType) report.barrierType = req.body.barrierType;

        const updatedReport = await report.save();
        res.json(updatedReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 
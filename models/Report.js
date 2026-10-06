const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    barrierType: {
        type: String,
        required: true,
        enum: ['stairs', 'narrow', 'doors', 'surface', 'other']
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'verified', 'resolved'],
        default: 'pending'
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema); 
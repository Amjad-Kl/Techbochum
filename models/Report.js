const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        trim: true
    },
    barrierType: {
        type: String,
        required: true,
        enum: ['stairs', 'narrow', 'doors', 'surface', 'elevator', 'construction', 'other']
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
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
    photo: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);
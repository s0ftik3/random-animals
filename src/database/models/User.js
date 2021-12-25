'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    username: String,
    language: String,
    silent: {
        type: Boolean,
        required: false,
        default: false
    },
    generated: {
        type: Number,
        required: false,
        default: 0
    },
    santa: {
        type: Number,
        required: false,
        default: 0
    },
    newYear: {
        type: Boolean,
        required: false,
        default: false
    },
    timestamp: {
        type: Date,
        required: false,
        default: new Date()
    }
});

module.exports = mongoose.model('User', userSchema);
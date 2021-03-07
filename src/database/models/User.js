const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    language: {
        type: String,
        required: false,
        default: 'en'
    },
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
    timestamp: {
        type: Date,
        required: false,
        default: new Date()
    }
});

module.exports = mongoose.model('User', userSchema);
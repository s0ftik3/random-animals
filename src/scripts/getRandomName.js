'use strict';

const toCapital = require('./toCapital');
const adjectives = require('../assets/adjectives.json');
const animals = require('../assets/animals.json');

module.exports = () => {
    try {
        const i = Math.floor(Math.random() * adjectives.length);
        const k = Math.floor(Math.random() * animals.length);

        const adjective = toCapital(adjectives[i]);
        const animal = toCapital(animals[k]);

        const name = `${adjective} ${animal}`;

        return {
            adjective: adjectives[i],
            animal: animals[k],
            name: name,
        };
    } catch (err) {
        console.error(err);
    }
};
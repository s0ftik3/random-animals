"use strict"

const sharp = require('sharp');

module.exports = async (animal) => {
    const start_ts = new Date().getTime();
    
    sharp.concurrency(1);

    const colors = require('../assets/colors.json');
    const animals = require('../assets/animals-svg.json');

    const i = Math.floor(Math.random() * colors.length);

    const animalPath = Buffer.from(animals.find(e => e.name === animal).data);
    
    const background = await sharp({
            create: {
                width: 1500,
                height: 1500,
                channels: 3,
                background: colors[i]
            }
        })
        .png()
        .toBuffer()
        .then(data => data);

    const animalResized = await sharp(animalPath, { density: 450 })
        .resize({ width: 800 })
        .toBuffer()
        .then(data => data);

    const result = await sharp(background)
        .composite([{ input: animalResized, gravity: 'centre' }])
        .toBuffer()
        .then(data => data);

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Last proccess memory usage: ${Math.round(used * 100) / 100} MB. Time taken: ${new Date().getTime() - start_ts}ms`);

    return {
        image: result,
        type: 'base64'
    }
}
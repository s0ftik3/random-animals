'use strict';

const sharp = require('sharp');

module.exports = async (animal, id, color = null) => {
    try {
        const start_ts = new Date().getTime();

        sharp.concurrency(1);

        const colors = require('../assets/colors.json');
        const animals = require('../assets/animals-svg.json');

        const i = Math.floor(Math.random() * colors.length);

        const animalPath = Buffer.from(animals.find((e) => e.name === animal).data);

        const background = await sharp({
            create: {
                width: 1500,
                height: 1500,
                channels: 3,
                background: (color === null) ? colors[i] : color
            },
        })
            .png()
            .toBuffer();

        const animalResized = await sharp(animalPath, { density: 450 }).resize({ width: 800 }).toBuffer();

        const result = await sharp(background)
            .composite([{ input: animalResized, gravity: 'centre' }])
            .toBuffer();

        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`[${id}] ${Math.round(used * 100) / 100}mb in ${new Date().getTime() - start_ts}ms.`);

        return {
            image: result,
            type: 'buffer',
            color: (color === null) ? colors[i] : color
        };
    } catch (err) {
        console.error(err);
    }
};
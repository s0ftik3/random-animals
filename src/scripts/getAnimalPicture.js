const sharp = require('sharp');

module.exports = async (animal) => {
    const colors = require('../assets/colors.json');

    const i = Math.floor(Math.random() * colors.length);

    const backgroundPath = `./src/assets/backgrounds/${colors[i]}.png`;
    const animalPath = `./src/assets/animals/${animal}.svg`;

    const animalResized = await sharp(animalPath, { density: 450 })
        .resize({ width: 700 })
        .toBuffer()
        .then(data => data);

    const result = await sharp(backgroundPath)
        .composite([{ input: animalResized, gravity: 'centre' }])
        .toBuffer()
        .then(data => data);

    return {
        image: result,
        type: 'base64'
    }
}

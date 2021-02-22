const sharp = require('sharp');

module.exports = async (animal) => {
    const colors = require('../assets/colors.json');

    const i = Math.floor(Math.random() * colors.length);

    const backgroundPath = `./src/assets/backgrounds/${colors[i]}.png`;
    const animalPath = `./src/assets/animals/${animal}.png`;

    const metadata = await sharp(animalPath).metadata();

    const animalResized = await sharp(animalPath)
        .resize({ width: (metadata.height - metadata.width >= 900) ? 500 : 700 })
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

const Jimp = require('jimp');
const fs = require('fs');
const saveImageRatio = require('./saveImageRatio');

module.exports = async (ctx, animal) => {
    const colors = require('../assets/colors.json');

    const i = Math.floor(Math.random() * colors.length);

    const backgroundPath = `./src/assets/backgrounds/${colors[i]}.png`;
    const animalPath = `./src/assets/animals/${animal}.png`;

    const imageFile = await Jimp.read(animalPath);

    let newWidth = 700; // Default value.
    if (imageFile.bitmap.height - imageFile.bitmap.width >= 1000) newWidth = 400; // If image proportions are too different.
    const newHeight = saveImageRatio(imageFile.bitmap.width, imageFile.bitmap.height, newWidth);

    imageFile.resize(newWidth, newHeight);
    imageFile.color([{ apply:'tint', params: [100] }]);

    const newX = (1500 - newWidth) / 2;
    const newY = (1500 - newHeight) / 2;

    const animalBuffer = await imageFile.getBufferAsync(Jimp.MIME_PNG).then(response => response);

    const jimps = [Jimp.read(animalBuffer), Jimp.read(backgroundPath)];

    const image = await Promise.all(jimps).then(() => {
        return Promise.all(jimps);
    }).then(async data => {
        data[1].composite(data[0], newX, newY);

        const buffer = await data[1].getBufferAsync(Jimp.MIME_PNG).then(response => response);

        return buffer.toString('base64');
    });

    return {
        image: image,
        type: 'base64'
    };
}

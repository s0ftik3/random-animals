const Jimp = require('jimp');
const saveImageRatio = require('./saveImageRatio');

module.exports = async (ctx, animal) => {
    const name = animal;
    let colors = require('../assets/colors.json');

    const i = Math.floor(Math.random() * colors.length);

    if (ctx.session.requests === 20) colors[i] = 'black';
    if (ctx.session.requests === 40) colors[i] = 'black';
    if (ctx.session.requests === 60) colors[i] = 'black';
    if (ctx.session.requests === 80) colors[i] = 'black';
    if (ctx.session.requests >= 100) colors = [...colors, 'black'];

    const backgroundPath = `./src/assets/backgrounds/${colors[i]}.png`;
    const animalPath = `./src/assets/animals/${name}.png`;

    const fs = require('fs');
    const inputBuffer = fs.readFileSync(animalPath);
    const imageFile = await Jimp.read(inputBuffer);

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
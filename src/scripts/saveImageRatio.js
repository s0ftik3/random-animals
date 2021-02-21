module.exports = (width, height, newWidth) => {
    const newHeight = (newWidth * height) / width;
    const rounded = Math.round((newHeight + Number.EPSILON) * 100) / 100;

    return rounded;
}
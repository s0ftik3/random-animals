/**
 * No need in this function anymore since sharp library
 * saves proportions itself.
 */
module.exports = (width, height, newWidth) => {
    const newHeight = (newWidth * height) / width;
    const rounded = Math.round((newHeight + Number.EPSILON) * 100) / 100;

    return rounded;
};
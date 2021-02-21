module.exports = (string) => {
    const firstLetter = string.split('')[0];
    const capitalizedLetter = firstLetter.toUpperCase();
    const result = capitalizedLetter + string.slice(1, string.length);

    return result;
}
"use strict"

module.exports = (string) => {
    try {
        const firstLetter = string.split('')[0];
        const capitalizedLetter = firstLetter.toUpperCase();
        const result = capitalizedLetter + string.slice(1, string.length);
    
        return result;
    } catch (err) {
        console.error(err);
    }
}
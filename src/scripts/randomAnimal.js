'use strict';

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const sharp = require('sharp');
const adjectives = require('../assets/adjectives.json');
const animals = require('../assets/animals.json');
const colors = require('../assets/colors.json');
const animals_svg = require('../assets/animals-svg.json');

module.exports = class RandomAnimal {
    /**
     * Generates random animal's data.
     * @returns
     */
    async getAnimal(ctx) {
        try {
            const name = await this.getRandomName();
            const image = await this.getAnimalPicture(name.animal, ctx.user.newYear);
            const usernameAvailable = await this.checkUsername(name.full_name);

            return {
                name: name.full_name,
                image,
                usernameAvailable,
            };
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @private
     */
    async getRandomName() {
        try {
            const i = Math.floor(Math.random() * adjectives.length);
            const k = Math.floor(Math.random() * animals.length);

            const adjective = this.capitalize(adjectives[i]);
            const animal = this.capitalize(animals[k]);

            const name = `${adjective} ${animal}`;

            return {
                adjective: adjectives[i],
                animal: animals[k],
                full_name: name,
            };
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @private
     */
    async getAnimalPicture(animal, snow) {
        try {
            sharp.concurrency(0);

            const i = Math.floor(Math.random() * colors.length);

            const animalPath = Buffer.from(
                animals_svg.find((e) => e.name === animal).data
            );

            const background = await sharp({
                create: {
                    width: 1500,
                    height: 1500,
                    channels: 3,
                    background: colors[i]
                },
            })
                .png()
                .toBuffer();

            const animalResized = await sharp(animalPath, { density: 450 })
                .resize({ width: 800 })
                .toBuffer();

            if (snow) {
                const snow = fs.readFileSync('./src/assets/snow.png');

                const result = await sharp(background)
                    .composite([
                        { input: snow },
                        { input: animalResized, gravity: 'centre' }
                    ])
                    .toBuffer();

                return result;
            } else {
                const result = await sharp(background)
                    .composite([
                        { input: animalResized, gravity: 'centre' }
                    ])
                    .toBuffer();

                return result;
            }
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @private
     */
    async checkUsername(name) {
        try {
            const page = await axios(
                `https://t.me/${name.toLowerCase().replace(/\s/g, '')}`
            ).then((response) => response.data);
            const $ = cheerio.load(page);
            const username = $('body')
                .find('div[class="tgme_page_extra"]')
                .text();

            const isAvailable = username.length <= 0 ? true : false;

            return isAvailable;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @private
     */
    capitalize(string) {
        try {
            return string.charAt(0).toUpperCase() + string.slice(1);
        } catch (err) {
            console.error(err);
        }
    }
};

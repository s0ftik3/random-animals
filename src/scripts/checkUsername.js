const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (data) => {
    const adjective = data.adjective;
    const animal = data.animal;

    const pageData = await axios(`https://t.me/${adjective}${animal}`).then(response => response.data);
    const $ = cheerio.load(pageData);
    const username = $('body').find('div[class="tgme_page_extra"]').text();

    const isAvailable = (username.length <= 0) ? true : false;

    return isAvailable;
}
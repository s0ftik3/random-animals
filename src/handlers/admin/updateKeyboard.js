const User = require('../../database/models/User');
const Markup = require('telegraf/markup');
const config = require('../../../config');

const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

module.exports = () => (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;

        // User.find().then(response => {
        //     const users = response;

        //     function mailing(i) {
        //         const keyboard = Markup.keyboard([
        //             [i18n.t(users[i].language, 'button.new_animal')],
        //             [i18n.t(users[i].language, 'button.settings')]
        //         ])
        //         .resize()
        //         .extra();

        //         setTimeout(() => {
        //             ctx.telegram.sendMessage(users[i].id, (users[i].language === 'en') ? 'The keyboard has been updated.' : 'Клавиатура была обновлена.', {
        //                 reply_markup: keyboard.reply_markup,
        //                 disable_notification: true 
        //             });
        //         }, i * 1000);
        //     }

        //     for (let i = 0; i < users.length; i++) {
        //         if (i === users.length - 1) ctx.reply('All users are notificated.');
        //         mailing(i);
        //     }
        // });
    } catch (err) {
        console.error(err);
    }
}
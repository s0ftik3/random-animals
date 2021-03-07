const User = require('../database/models/User');
const Markup = require('telegraf/markup');
const getUserSession = require('../scripts/getUserSession');
const fs = require('fs');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        const buttons = [];

        const locales_folder = fs.readdirSync('./src/locales/');

        locales_folder.forEach(file => {

            const localization = file.split('.')[0];
            buttons.push(
                Markup.callbackButton(i18n.t(localization, 'language'), `setLang:${localization}`)
            );
                    
        });

        const keyboard = buttons.filter(e => e.callback_data != `setLang:${ctx.session.user.language}`);
        const ready_keyboard = Markup.inlineKeyboard(keyboard, { columns: 2 });
        ready_keyboard.inline_keyboard.push([Markup.callbackButton(i18n.t(user.language, 'button.back'), `settings`)]);

        if (ctx.match[0].match(/setLang:(.*)/g) !== null) {
            const language = ctx.match[0].split(':')[1];
            ctx.i18n.locale(language);
    
            await User.updateOne({ id: ctx.from.id }, { $set: { language: language } }, () => {});
            ctx.session.user.language = language;

            ctx.deleteMessage();

            ctx.reply(ctx.i18n.t('service.language_changed'),
                Markup.keyboard([
                    [ctx.i18n.t('button.new_animal')],
                    [ctx.i18n.t('button.settings')]
                ])
                .resize()
                .extra()
            );
        } else {
            ctx.editMessageText(ctx.i18n.t('service.change_language'), {
                reply_markup: ready_keyboard
            });
        }
    } catch (err) {
        console.error(err);
    }
}
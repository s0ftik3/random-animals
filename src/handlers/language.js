'use strict';

const Markup = require('telegraf/markup');
const fs = require('fs');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true,
});

module.exports = () => async (ctx) => {
    try {
        const action = ctx.match;

        const buttons = [];
        const localesFolder = fs.readdirSync('./src/locales/');

        localesFolder.forEach((file) => {
            const localization = file.split('.')[0];
            buttons.push(
                Markup.callbackButton(
                    i18n.t(localization, 'language'),
                    `language:${localization}`
                )
            );
        });

        buttons.push(
            Markup.callbackButton(ctx.i18n.t('button.back'), 'settings')
        );

        const keyboard = buttons.filter(
            (e) => e.callback_data != `language:${ctx.user.language}`
        );

        if (action === 'language') {
            await ctx.editMessageText(ctx.i18n.t('service.change_language'), {
                reply_markup: Markup.inlineKeyboard(keyboard, { columns: 2 }),
            });
        } else {
            const language = ctx.match[0].split(':')[1];
            ctx.i18n.locale(language);

            ctx.user.language = language;
            await ctx.user.save();

            await ctx.deleteMessage();

            await ctx.replyWithHTML(
                ctx.i18n.t('service.language_changed'),
                Markup.keyboard([
                    [ctx.i18n.t('button.new_animal')],
                    [ctx.i18n.t('button.settings')],
                ])
                    .resize()
                    .extra()
            );

            await ctx.answerCbQuery();
        }
    } catch (err) {
        console.error(err);
    }
};

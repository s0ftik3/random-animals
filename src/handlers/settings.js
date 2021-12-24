const Markup = require('telegraf/markup');
const getUserSession = require('../scripts/getUserSession');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        if (ctx.updateType === 'callback_query') {
            ctx.editMessageText(ctx.i18n.t('service.settings'), {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t('button.change_lang'), `language`)],
                    [Markup.callbackButton(ctx.i18n.t('button.silent_mode', { status: user.silent ? ctx.i18n.t('action.a_on') : ctx.i18n.t('action.a_off') }), `silent`)],
                ])
            });

            ctx.answerCbQuery();
        } else {
            ctx.reply(ctx.i18n.t('service.settings'), {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t('button.change_lang'), `language`)],
                    [Markup.callbackButton(ctx.i18n.t('button.silent_mode', { status: user.silent ? ctx.i18n.t('action.a_on') : ctx.i18n.t('action.a_off') }), `silent`)],
                ])
            });
        }
    } catch (err) {
        console.error(err);
    }
};
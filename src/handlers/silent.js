const User = require('../database/models/User');
const Markup = require('telegraf/markup');
const getUserSession = require('../scripts/getUserSession');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        await User.updateOne({ id: ctx.from.id }, { $set: { silent: (user.silent) ? false : true } }, () => {});
        ctx.session.user.silent = (user.silent) ? false : true;

        if (!user.silent) {
            ctx.editMessageText(ctx.i18n.t('service.settings'), {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t('button.change_lang'), `language`), Markup.callbackButton(ctx.i18n.t('button.silent_mode', { status: '' }), `silent`)],
                    [Markup.urlButton(ctx.i18n.t('button.suggest_or_report'), `https://t.me/id160`)]
                ])
            });

            ctx.answerCbQuery(ctx.i18n.t('service.silent_off'));
        } else {
            ctx.editMessageText(ctx.i18n.t('service.settings'), {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t('button.change_lang'), `language`), Markup.callbackButton(ctx.i18n.t('button.silent_mode', { status: '✅' }), `silent`)],
                    [Markup.urlButton(ctx.i18n.t('button.suggest_or_report'), `https://t.me/id160`)]
                ])
            });

            ctx.answerCbQuery(ctx.i18n.t('service.silent_on'));
        }
    } catch (err) {
        console.error(err);
    }
}
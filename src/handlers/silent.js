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
            ctx.reply(ctx.i18n.t('service.silent_off'), 
                Markup.keyboard([
                    [ctx.i18n.t('button.new_animal')],
                    [ctx.i18n.t('button.silent_mode', { status: '' })],
                    [ctx.i18n.t('button.change_lang')]
                ])
                .resize()
                .extra()
            )
        } else {
            ctx.reply(ctx.i18n.t('service.silent_on'), 
                Markup.keyboard([
                    [ctx.i18n.t('button.new_animal')],
                    [ctx.i18n.t('button.silent_mode', { status: '✅' })],
                    [ctx.i18n.t('button.change_lang')]
                ])
                .resize()
                .extra()
            )
        }
    } catch (err) {
        console.error(err);
    }
}
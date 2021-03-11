"use strict"

module.exports = (ctx, code) => {
    try {
        switch (code) {
            case 0:
                ctx.reply(ctx.i18n.t('error.common'));
                console.error({
                    code: 0,
                    type: 'error',
                    message: `User ${ctx.from.id} isn't recorded in the database or there are some incorrect lines.`
                });
                break;
            case 1:
                ctx.reply(ctx.i18n.t('error.limit_exceeded'));
                break;
            case 2:
                break;
            default:
                ctx.reply(ctx.i18n.t('error.common'));
                console.error({
                    code: 'default',
                    type: 'error',
                    message: `Something happed with the ${ctx.from.id} user.`
                });
                break;
        }
    } catch (err) {
        console.error(err);
    }
}
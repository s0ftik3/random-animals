'use strict';

module.exports = () => async (ctx) => {
    try {
        if (ctx.user.santa >= 5) {
            await ctx.editMessageReplyMarkup();
            await ctx.answerCbQuery();
        } else if (ctx.user.santa === 4) {
            ctx.user.santa = ctx.user.santa + 1;

            await ctx.editMessageReplyMarkup();

            await ctx.answerCbQuery(ctx.i18n.t('service.last_santa_caught'), true);
    
            await ctx.user.save();
        } else {
            ctx.user.santa = ctx.user.santa + 1;

            await ctx.editMessageReplyMarkup();

            await ctx.answerCbQuery(ctx.i18n.t('service.santa_caught', { santa: ctx.user.santa }), true);
    
            await ctx.user.save();
        }
    } catch (err) {
        console.error(err);
    }
};

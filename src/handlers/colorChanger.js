const Markup = require('telegraf/markup');
const colors = require('../assets/colors.json');
const getUserSession = require('../scripts/getUserSession');
const getAnimalPicture = require('../scripts/getAnimalPicture');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        ctx.answerCbQuery(ctx.i18n.t('service.updating_picture'));

        const params = ctx.match[1].split(':');
        const color = params[0];
        const animal = params[1];
        const name = params[2];
        const next_color = colors[colors.indexOf(color, 0) + 1];
        const condition = (next_color === undefined) ? '#294659' : next_color;

        const imageData = await getAnimalPicture(animal, ctx.from.id, color);
        const messageData = {
            source: imageData.image,
            filename: `${name.replace(/\s/g, '-')}.png`,
        };

        await ctx.deleteMessage()
        ctx.replyWithDocument(messageData, {
            reply_markup: Markup.inlineKeyboard([
                [Markup.callbackButton(ctx.i18n.t('button.change_color'), `to_color:${condition}:${animal}:${name}`)]
            ])
        });
    } catch (err) {
        console.error(err);
    }
};
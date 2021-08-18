const User = require('../database/models/User');
const Markup = require('telegraf/markup');
const colors = require('../assets/colors.json');
const getRandomName = require('../scripts/getRandomName');
const getAnimalPicture = require('../scripts/getAnimalPicture');
const getUserSession = require('../scripts/getUserSession');
const checkUsername = require('../scripts/checkUsername');
const replyWithError = require('../scripts/replyWithError');
const checkSubscription = require('../scripts/checkSubscription');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const is_member = await checkSubscription(ctx).then(response => response);
        if (user.generated > 30 && !is_member) return replyWithError(ctx, 11);

        ctx.replyWithChatAction('upload_document');

        const nameData = getRandomName();
        const imageData = await getAnimalPicture(nameData.animal, ctx.from.id);
        const messageData = {
            source: imageData.image,
            filename: `${nameData.name.replace(/\s/g, '-')}.png`,
        };
        const next_color = colors[colors.indexOf(imageData.color, 0) + 1];
        const condition = (next_color === undefined) ? colors[0] : next_color;

        User.updateOne({ id: ctx.from.id }, { $set: { generated: user.generated + 1 } }, () => {});
        ctx.session.user.generated = user.generated + 1;

        switch (user.silent) {
            case true:
                ctx.replyWithDocument(messageData, {
                    reply_markup: Markup.inlineKeyboard([
                        [Markup.callbackButton(ctx.i18n.t('button.change_color'), `to_color:${condition}:${nameData.animal}:${nameData.name}`)]
                    ])
                });
                break;

            case false:
                const messageExtra = {
                    caption: ctx.i18n.t('service.new_animal_message', {
                        animal_name: nameData.name,
                    }),
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        [Markup.callbackButton(ctx.i18n.t('button.change_color'), `to_color:${condition}:${nameData.animal}:${nameData.name}`)]
                    ])
                };

                await ctx.replyWithDocument(messageData, messageExtra).then((response) => (ctx.session.last_message_id = response.message_id));

                const isAvailable = await checkUsername(nameData);

                if (isAvailable) {
                    const salt = Math.floor(Math.random() * 4);

                    ctx.reply(
                        ctx.i18n.t(`service.username_available_${salt}`, {
                            username: `@${nameData.name.replace(/\s/g, '')}`,
                        }),
                        {
                            reply_to_message_id: ctx.session.last_message_id,
                        }
                    );
                }
                break;

            default:
                replyWithError(ctx, 0);
                break;
        }
    } catch (err) {
        console.error(err);
    }
};
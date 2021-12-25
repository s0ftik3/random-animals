'use strict';

const Markup = require('telegraf/markup');
const RandomAnimal = require('../scripts/randomAnimal');

module.exports = () => async (ctx) => {
    try {
        await ctx.replyWithChatAction('upload_document');

        const randomAnimal = new RandomAnimal();
        const animal = await randomAnimal.getAnimal(ctx);

        // New Year's event. Will be removed.
        let santaExtra;

        if (ctx.user.santa < 5) {
            if (Math.floor(Math.random() * 5) === 3) {
                santaExtra = {
                    reply_markup: Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(
                                ctx.i18n.t('button.santa'),
                                `santa`
                            ),
                        ],
                    ]),
                };
            }
        }

        if (ctx.user.silent) {
            await ctx.replyWithDocument(
                {
                    source: animal.image,
                    filename: `${animal.name.replace(/\s/g, '-')}.png`,
                },
                { ...santaExtra }
            );
        } else {
            await ctx
                .replyWithDocument(
                    {
                        source: animal.image,
                        filename: `${animal.name.replace(/\s/g, '-')}.png`,
                    },
                    {
                        caption: ctx.i18n.t('service.new_animal_message', {
                            animal_name: animal.name,
                        }),
                        parse_mode: 'HTML',
                        ...santaExtra,
                    }
                )
                .then((response) => {
                    ctx.session.last_message_id = response.message_id;
                });

            if (animal.usernameAvailable) {
                const i = Math.floor(Math.random() * 4);

                await ctx.replyWithHTML(
                    ctx.i18n.t(`service.username_available_${i}`, {
                        username: `@${animal.name.replace(/\s/g, '')}`,
                    }),
                    {
                        reply_to_message_id: ctx.session.last_message_id,
                    }
                );
            }
        }

        ctx.user.generated = ctx.user.generated + 1;
        await ctx.user.save();
    } catch (err) {
        console.error(err);
    }
};

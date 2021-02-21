const getUser = require('../database/getUser');
const recordUser = require('../database/recordUser');
const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {
        const user = await getUser(ctx.from.id).then(response => response);

        if (user === null) {
            const data = {
                id: ctx.from.id,
                firstName: (ctx.from.first_name == undefined) ? null : ctx.from.first_name,
                lastName: (ctx.from.last_name == undefined) ? null : ctx.from.last_name,
                username: (ctx.from.username == undefined) ? null : ctx.from.username,
                language: 'en'
            };

            recordUser(data).then(() => {
                ctx.session.user = data;
                ctx.reply(ctx.i18n.t('service.greeting', { name: ctx.from.first_name }), 
                    Markup.keyboard([
                        [ctx.i18n.t('button.new_animal')],
                        [ctx.i18n.t('button.change_lang')]
                    ])
                    .resize()
                    .extra()
                );
            });
        } else {
            ctx.i18n.locale(user.language);
            
            ctx.reply(ctx.i18n.t('service.greeting', { name: user.firstName }),
                Markup.keyboard([
                    [ctx.i18n.t('button.new_animal')],
                    [ctx.i18n.t('button.change_lang')]
                ])
                .resize()
                .extra()
            );
        }
    } catch (err) {
        console.error(err);
    }
}
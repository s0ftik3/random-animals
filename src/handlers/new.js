const User = require('../database/models/User');
const getRandomName = require('../scripts/getRandomName');
const getAnimalPicture = require('../scripts/getAnimalPicture');
const getUserSession = require('../scripts/getUserSession');
const checkUsername = require('../scripts/checkUsername');

module.exports = () => async (ctx) => {
    try {
        ctx.replyWithChatAction('upload_document');
        
        const user = await getUserSession(ctx).then(response => response);
        
        const nameData = getRandomName();
        const imageData = await getAnimalPicture(nameData.animal);
    
        ctx.i18n.locale(user.language);
    
        const messageData = { 
            source: imageData.image, 
            filename: `${nameData.name.replace(/\s/g, '-')}.png` 
        };

        User.updateOne({ id: ctx.from.id }, { $set: { generated: user.generated + 1 } }, () => {});
        ctx.session.user.generated = user.generated + 1;

        if (user.silent) {
            return ctx.replyWithDocument(messageData);
        }

        const messageExtra = {
            caption: ctx.i18n.t('service.new_animal_message', { 
                animal_name: nameData.name 
            }), 
            parse_mode: 'Markdown' 
        };

        await ctx.replyWithDocument(messageData, messageExtra).then(response => ctx.session.last_message_id = response.message_id);

        const isAvailable = await checkUsername(nameData);

        if (isAvailable) {
            ctx.reply(ctx.i18n.t('service.username_available', { 
                username: `@${nameData.name.replace(/\s/g, '')}` 
            }), { 
                reply_to_message_id: ctx.session.last_message_id 
            });
        } else {
            return;
        }
    } catch (err) {
        console.error(err);
    }
}
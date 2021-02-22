const getRandomName = require('../scripts/getRandomName');
const getAnimalPicture = require('../scripts/getAnimalPicture');
const getUserSession = require('../scripts/getUserSession');

module.exports = () => async (ctx) => {
    try {
        ctx.replyWithChatAction('upload_document');
        
        const user = await getUserSession(ctx).then(response => response);
        
        const nameData = getRandomName();
        const imageData = await getAnimalPicture(nameData.animal);
        const image = Buffer.from(imageData.image, 'base64');
    
        ctx.i18n.locale(user.language);
    
        const messageData = { 
            source: image, 
            filename: `${nameData.name.replace(/\s/g, '-')}.png` 
        };
        const messageExtra = {
            caption: ctx.i18n.t('service.new_animal_message', { 
                animal_name: nameData.name 
            }), 
            parse_mode: 'Markdown' 
        };
    
        return ctx.replyWithDocument(messageData, messageExtra);
    } catch (err) {
        console.error(err);
    }
}
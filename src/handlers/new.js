const getRandomName = require('../scripts/getRandomName');
const getAnimalPicture = require('../scripts/getAnimalPicture');
const getUserSession = require('../scripts/getUserSession');

module.exports = () => async (ctx) => {
    const user = await getUserSession(ctx).then(response => response);
    ctx.replyWithChatAction('upload_document');

    const nameData = getRandomName();
    const imageData = await getAnimalPicture(ctx, nameData.animal);
    const image = Buffer.from(imageData.image.replace('data:image/png;base64,', ''), 'base64');

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

    ctx.session.requests = (ctx.session.requests === undefined) ? 1 : ctx.session.requests + 1;

    return ctx.replyWithDocument(messageData, messageExtra);
}
const User = require('../../database/models/User');
const config = require('../../../config');

module.exports = () => async (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;

        await User.deleteOne({ id: ctx.from.id });
        ctx.session.user = undefined;

        ctx.reply('/start', { reply_markup: { remove_keyboard: true } });
    } catch (err) {
        console.error(err);
    }
};
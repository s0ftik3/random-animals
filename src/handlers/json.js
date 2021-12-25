'use strict';

module.exports = () => (ctx) => {
    try {
        return ctx.replyWithHTML(`<code>${JSON.stringify(ctx.message, null, 2)}</code>`);
    } catch (err) {
        console.error(err);
    }
};
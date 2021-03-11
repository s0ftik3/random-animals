module.exports = {
    "token": process.env.TOKEN,
    "database": process.env.DATABASE,
    "admin": process.env.ADMIN,
    "limit": {
        window: 1000,
        limit: 1,
        onLimitExceeded: ctx => { 
            ctx.reply(i18n.t((ctx.session.user === undefined) ? 'en' : ctx.session.user.language, 'error.limit_exceeded'));
        }
    }
}
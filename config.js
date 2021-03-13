module.exports = {
    token: process.env.TOKEN,
    database: process.env.DATABASE,
    admin: process.env.ADMIN,
    limit: {
        window: 1000,
        limit: 1,
        onLimitExceeded: (ctx) => require('./src/scripts/replyWithError')(ctx, 1),
    },
};
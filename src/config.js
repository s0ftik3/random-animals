module.exports = {
    token: process.env.TOKEN,
    database: process.env.DATABASE,
    handler_timeout: 100,
    limit: {
        window: 1000,
        limit: 1,
        onLimitExceeded: (ctx) => require('./scripts/replyWithError')(ctx, 1),
    }
};
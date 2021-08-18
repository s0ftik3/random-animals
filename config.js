module.exports = {
    token: process.env.TOKEN,
    database: process.env.DATABASE,
    admin: process.env.ADMIN,
    channel: process.env.CHANNEL,
    limit: {
        window: 1000,
        limit: 1,
        onLimitExceeded: (ctx) => require('./src/scripts/replyWithError')(ctx, 1),
    },
    handler_timeout: 100,
    button: {
        new_animal: [
            'New Animal', 
            'Новое животное',
            'Yeni Hayvan'
        ],
        settings: [
            'Settings', 
            'Настройки',
            'Ayarlar'
        ]
    }
};
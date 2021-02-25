const Telegraf = require('telegraf');
const config = require('./config');
const bot = new Telegraf(config.token);
const rateLimit = require('telegraf-ratelimit')

const session = require('telegraf/session');

const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, './src/locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

const connect = require('./src/database/connect');

const {
    handleStart,
    handleNew,
    handleLanguage,
    handleSilent
} = require('./src/handlers');

const limitConfig = {
    window: 2000,
    limit: 1,
    onLimitExceeded: ctx => ctx.reply(i18n.t((ctx.session.user === undefined) ? 'en' : ctx.session.user.language, 'service.limit_exceeded'))
};

bot.use(i18n.middleware());
bot.use(session());
bot.use(rateLimit(limitConfig))

bot.start(handleStart());
bot.hears(['New Animal', 'Новое животное'], handleNew());
bot.hears(['Change Language', 'Сменить язык'], handleLanguage());
bot.hears(['Silent Mode', 'Тихий режим', 'Silent Mode ✅', 'Тихий режим ✅'], handleSilent());
bot.command(['lang', 'language'], handleLanguage());
bot.action(/setLang:\w+/, handleLanguage());

bot.on('callback_query', ctx => ctx.answerCbQuery());

bot.launch().then(() => {
    console.log('The bot has been started.');
    connect();
});
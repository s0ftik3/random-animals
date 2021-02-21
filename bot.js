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
    handleLanguage
} = require('./src/handlers');

const limitConfig = {
    window: 2000,
    limit: 1
};

bot.use(i18n.middleware());
bot.use(session());
bot.use(rateLimit(limitConfig))

bot.start(handleStart());
bot.hears(['New Animal', 'Новое животное'], handleNew());
bot.hears(['Change Language', 'Сменить язык'], handleLanguage());
bot.command(['lang', 'language'], handleLanguage());
bot.action(/setLang:\w+/, handleLanguage());

bot.launch().then(() => {
    console.log('The bot has been started.');
    connect();
});
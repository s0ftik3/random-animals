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
    handleSilent,
    handleReset,
    handleSettings,
    handleCallback,
    handleJson
} = require('./src/handlers');

bot.use(i18n.middleware());
bot.use(session());
bot.use(rateLimit(require('./config').limit));

bot.start(handleStart());
bot.hears(config.button.new_animal, handleNew());
bot.hears(config.button.settings, handleSettings());
bot.action('language', handleLanguage());
bot.action('settings', handleSettings());
bot.action('silent', handleSilent());
bot.action(/setLang:\w+/, handleLanguage());
bot.command('reset', handleReset());
bot.command('json', handleJson());
bot.on('callback_query', handleCallback());

bot.launch().then(() => {
    console.log('The bot has been started.');
    connect();
});
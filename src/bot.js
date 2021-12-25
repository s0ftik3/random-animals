'use strict';

const Telegraf = require('telegraf');
const config = require('./config');
const bot = new Telegraf(config.token, { handlerTimeout: config.handler_timeout });

const rateLimit = require('telegraf-ratelimit')
const session = require('telegraf/session');

const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, './locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

const connect = require('./database/connect');
const attachUser = require('./middlewares/attachUser');
const ignoreOldMessages = require('./middlewares/ignoreOldMessages');
const actions = require('./assets/actions.json');
const {
    handleStart,
    handleGenerate,
    handleSettings,
    handleSilent,
    handleSanta,
    handeNewYear,
    handleJson,
    handleLanguage,
    handleCallback
} = require('./handlers');

bot.use(i18n.middleware());
bot.use(session());
bot.use(ignoreOldMessages());
bot.use(attachUser());
bot.use(rateLimit(config.limit));

bot.start(handleStart());

bot.command('settings', handleSettings());
bot.command('json', handleJson());

bot.hears(actions.old_generate, handleGenerate()); // for backward compatibility
bot.hears(actions.generate, handleGenerate());
bot.hears(actions.settings, handleSettings());

bot.action('santa', handleSanta());
bot.action('newYear', handeNewYear());
bot.action('settings', handleSettings());
bot.action('language', handleLanguage());
bot.action(/language:(.*)/, handleLanguage());
bot.action('silent', handleSilent());

bot.on('callback_query', handleCallback());

bot.launch().then(async () => {
    await connect();
    console.log(`[${bot.context.botInfo.first_name}] The bot has been started --> https://t.me/${bot.context.botInfo.username}`);
});
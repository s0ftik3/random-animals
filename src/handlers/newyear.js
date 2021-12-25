'use strict';

const Markup = require('telegraf/markup');
const moment = require('moment');
const plural = require('plural-ru');

module.exports = () => async (ctx) => {
    try {
        ctx.user.newYear = ctx.user.newYear ? false : true;

        if (!ctx.user.newYear) {
            await ctx.editMessageText(
                ctx.i18n.t(ctx.user.santa >= 5 ? 'service.settings_all_santa' : 'service.settings', {
                    santa: ctx.user.santa,
                    period: moment(ctx.user.timestamp).from(new Date(), true),
                    number: ctx.user.generated,
                    verb:
                        ctx.user.language === 'ru'
                            ? plural(
                                  ctx.user.generated,
                                  ctx.i18n.t('other.verb_1_21'),
                                  ctx.i18n.t('other.verb_2_23'),
                                  ctx.i18n.t('other.verb_5_11')
                              )
                            : ctx.user.generated > 1
                            ? ctx.i18n.t('other.verb_more')
                            : ctx.i18n.t('other.verb_one'),
                }),
                {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(
                                ctx.i18n.t('button.change_lang'),
                                `language`
                            ),
                        ],
                        [
                            Markup.callbackButton(
                                ctx.i18n.t('button.silent_mode', {
                                    status: ctx.user.silent
                                        ? ctx.i18n.t('action.a_on')
                                        : ctx.i18n.t('action.a_off'),
                                }),
                                `silent`
                            ),
                        ],
                        ctx.user.santa >= 5
                            ? [
                                  Markup.callbackButton(
                                      ctx.i18n.t('button.new_year_mode', {
                                          status: ctx.i18n.t('action.a_off'),
                                      }),
                                      `newYear`
                                  ),
                              ]
                            : [],
                    ]),
                }
            );

            await ctx.answerCbQuery();
        } else {
            await ctx.editMessageText(
                ctx.i18n.t(ctx.user.santa >= 5 ? 'service.settings_all_santa' : 'service.settings', {
                    santa: ctx.user.santa,
                    period: moment(ctx.user.timestamp).from(new Date(), true),
                    number: ctx.user.generated,
                    verb:
                        ctx.user.language === 'ru'
                            ? plural(
                                  ctx.user.generated,
                                  ctx.i18n.t('other.verb_1_21'),
                                  ctx.i18n.t('other.verb_2_23'),
                                  ctx.i18n.t('other.verb_5_11')
                              )
                            : ctx.user.generated > 1
                            ? ctx.i18n.t('other.verb_more')
                            : ctx.i18n.t('other.verb_one'),
                }),
                {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(
                                ctx.i18n.t('button.change_lang'),
                                `language`
                            ),
                        ],
                        [
                            Markup.callbackButton(
                                ctx.i18n.t('button.silent_mode', {
                                    status: ctx.user.silent
                                        ? ctx.i18n.t('action.a_on')
                                        : ctx.i18n.t('action.a_off'),
                                }),
                                `silent`
                            ),
                        ],
                        ctx.user.santa >= 5
                            ? [
                                  Markup.callbackButton(
                                      ctx.i18n.t('button.new_year_mode', {
                                          status: ctx.i18n.t('action.a_on')
                                      }),
                                      `newYear`
                                  ),
                              ]
                            : [],
                    ]),
                }
            );

            await ctx.answerCbQuery(ctx.i18n.t('service.newyear_on'), true);
        }

        await ctx.user.save();
    } catch (err) {
        console.error(err);
    }
};

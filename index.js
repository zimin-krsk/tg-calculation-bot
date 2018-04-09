/**
 * @ZiminKrskDummyCalcBot
 *
 * How set up ssl certificate:
 * curl -F "url=https://your.domain.or.ip.com" -F "certificate=@/etc/ssl/certs/bot.pem" https://api.telegram.org/bot537983199:AAE4wthgVYelGHPg3di39vbWVsK-q8a8ZqQ/setWebhook
 *
 * Telegram API cases:
 * - curl -F "url=https://db65cda9.ngrok.io"  https://api.telegram.org/bot537983199:AAE4wthgVYelGHPg3di39vbWVsK-q8a8ZqQ/setWebhook
 * - https://api.telegram.org/bot537983199:AAE4wthgVYelGHPg3di39vbWVsK-q8a8ZqQ/getWebhookInfo
 * - https://api.telegram.org/bot537983199:AAE4wthgVYelGHPg3di39vbWVsK-q8a8ZqQ/deleteWebHook
 *
 */
const {RELEASE_BOT_TOKEN} = require('./conf/constants');
const CalcBot = require('./engine/CalcBot');

const bot = new CalcBot(RELEASE_BOT_TOKEN);
bot.enrollQuery('1', bot.changeFormula.bind(bot));
bot.enrollQuery('2', bot.changeFormula.bind(bot));
bot.enrollQuery('3', bot.changeFormula.bind(bot));
bot.enrollQuery('4', bot.changeFormula.bind(bot));
bot.enrollQuery('5', bot.changeFormula.bind(bot));
bot.enrollQuery('6', bot.changeFormula.bind(bot));
bot.enrollQuery('7', bot.changeFormula.bind(bot));
bot.enrollQuery('8', bot.changeFormula.bind(bot));
bot.enrollQuery('9', bot.changeFormula.bind(bot));
bot.enrollQuery('0', bot.changeFormula.bind(bot));
bot.enrollQuery('+', bot.changeFormula.bind(bot));
bot.enrollQuery('-', bot.changeFormula.bind(bot));
bot.enrollQuery('=', bot.calculate.bind(bot));
bot.enrollQuery('AC', bot.reset.bind(bot));

bot.start();

// Start server for Heroku deploing
const {PORT, ROUTE_SECURITY_TOKEN} = require('./conf/constants');
let express = require('express');
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.listen(PORT, function() {
    console.log('Node app is running on port', PORT);
});


module.exports = bot;

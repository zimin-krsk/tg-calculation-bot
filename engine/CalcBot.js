const TelegramBotPolling = require('./TelegramBotPolling');

class CalcBot extends TelegramBotPolling {

    constructor(token) {
        super(token);
        this.keyboard = CalcBot.initKeyboard();
        this.wideText = 'Please input your formula using keyboard below:\r\n';
        this.formula = {};
        this.prevData = {};
    }

    static initKeyboard() {
        let keyboard = [
                [{text: 'AC', callback_data: 'AC'}, {text: '=', callback_data: '='}],
                [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
                [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
                [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
                [{text: '+', callback_data: '+'}, {text: '-', callback_data: '-'}, {text: '0', callback_data: '0'}]
        ];

        return {
            inline_keyboard: keyboard,
            resize_keyboard: false,
            one_time_keyboard: false
        };
    }

    startAction (message) {
        this.sendMessage({
            chat_id: message.chat.id,
            text: this.wideText,
            reply_markup: JSON.stringify({
                ...this.keyboard
            })
        });
    }

    helpAction(message) {
        this.sendMessage({
            chat_id: message.chat.id,
            text: 'Hello, I am dummy calc bot.\r\n' +
            'Below you can see my keyboard for input some formula, which I try solve for you.\r\n' +
            'Also you can type commands:\r\n' +
            '/start to begin calculation\r\n' +
            'and /help to display this information.'
        });
    }

    changeFormula(query) {
        let data = query.data;
        let message = query.message;

        if (!(data && message)) {
            return;
        }

        switch(this.prevData[message.chat.id]) {
            case '+':
            case '-':
                if (data === '+' || data === '-') {
                    this.formula[message.chat.id] = this.formula[message.chat.id].slice(0, -1) + data;
                }
                break;
            case 'AC':
            case '=':
                if (data === 'AC' || data === '=') {
                    this.formula[message.chat.id] = '';
                } else {
                    this.formula[message.chat.id] = data;
                }
                break;
            case undefined:
                this.formula[message.chat.id] = data;
                break;
            default:
                this.formula[message.chat.id] = this.formula[message.chat.id] + data;
        }

        this.prevData[message.chat.id] = data;
        let answer = {
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: this.wideText + this.formula[message.chat.id],
            reply_markup: JSON.stringify({
                ...this.keyboard
            })
        };

        this.editMessageText(answer);
        this.answerCallbackQuery({callback_query_id: query.id});
    }

    calculate(query) {
        let data = query.data;
        let message = query.message;

        if (!(data && message)) {
            return;
        }

        this.formula[message.chat.id] = 'Ohhh... it\'s very hard for me';
        this.prevData[message.chat.id] = data;
        let answer = {
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: this.wideText + this.formula[message.chat.id],
            reply_markup: JSON.stringify({
                ...this.keyboard
            })
        };

        this.editMessageText(answer);
        this.answerCallbackQuery({callback_query_id: query.id});
    }

    reset(query) {
        let data = query.data;
        let message = query.message;

        if (!(data && message)) {
            return;
        }

        this.formula[message.chat.id] = '';
        this.prevData[message.chat.id] = data;
        let answer = {
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: this.wideText,
            reply_markup: JSON.stringify({
                ...this.keyboard
            })
        };

        this.editMessageText(answer);
        this.answerCallbackQuery({callback_query_id: query.id});
    }
}

module.exports = CalcBot;

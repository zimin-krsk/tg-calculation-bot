const ApiOptions = require('./ApiOptions');
const request = require('request');
const API_URL = 'https://api.telegram.org';

class TelegramBot {

    get isStopped() {
        return !this.isAccessible;
    }

    get isStarted() {
        return this.isAccessible;
    }

    get isPolling() {
        return false;
    }

    get isWebHooking() {
        return false;
    }

    start() {
        throw new Error('Abstract bot can not be started');
    }

    stop() {
        throw new Error('Abstract bot is not started');
    }

    constructor(token) {
        this.token = token;
        this.botApiUrl = `${API_URL}/bot${this.token}`;
        this.isAccessible = false;
        this.callbackQueries = [];
        this.textMessages = [
            {data: '/start', callback: this.startAction.bind(this)},
            {data: '/help', callback: this.helpAction.bind(this)},
        ];
    }

    // This method can be private?
    initialize() {
        return this.fetchBotInfo().then(
            () => {
                console.log(`Bot token set up successful - ${this.token}`);
                console.log('Bot is accessible.');
                this.isAccessible = true;
            },
            (error) => {
                console.log(`Bot token set up successful - ${this.token}`);
                console.log(`Bot initialization failed.\r\n\tCause: ${error}`);
                console.log('Bot is not accessible.');
                this.isAccessible = false;
            }
        );
    }

    fetchBotInfo(){
        return new Promise((resolve, reject) => {
            request(`${this.botApiUrl}/getMe`, (error, r, body) => {
                if (error) {
                    reject(new Error(error));
                    return;
                }

                const response = JSON.parse(body);
                if (!TelegramBot.isValidResponse(response)) {
                    let error = `Calling telegram API is wrong. Response values [` +
                        `ok: ${response.ok}, error_code: ${response.error_code}, description: ${response.description}]`;
                    reject(new Error(error));
                    return;
                }

                const {result} = response;
                this.id = result.id || '';
                this.firstName = result.first_name || '';
                this.lastName = result.last_name || '';
                this.username = result.username || '';
                this.language = result.language_code || '';
                resolve();
            });
        })
    }

    static isValidResponse(response) {
        let successResult = response.ok || false;
        let errorCode = response.error_code || '';
        let description = response.description || '';
        let {result} = response;

        return successResult
            && errorCode.length === 0
            && description.length === 0
            && result;
    }

    // Intersection of data sources
    static preparePostedData(pattern, data) {
        if (data === undefined || pattern === undefined) {
            return {};
        }

        return Object.keys(data).reduce((memo, key) => {
                if (pattern[key] === undefined) return memo;
                if (data[key] === null) return memo;

                memo[key] = data[key];
                return memo;
            },
            {}
        );
    }

    /*
     * Bot core methods
     */

    // Do post request to Telegram API
    sendRequest(method, data) {
        if (this.isStopped) {
            return Promise.reject(new Error('Telegram Bot has not access'));
        }

        const pattern = ApiOptions[method];
        if (!pattern) {
            return Promise.reject(new Error('Telegram Bot unknown method to perform'));
        }

        return new Promise((resolve) => {
            request.post({
                url:`${this.botApiUrl}/${method}`,
                form: TelegramBot.preparePostedData(pattern, data)
            }, (error, r, body) => {
                const response = JSON.parse(body);
                if (error || !TelegramBot.isValidResponse(response)) {
                    let error = `Calling telegram API ${method} is failed. Response values [` +
                        `ok: ${response.ok}, error_code: ${response.error_code}, description: ${response.description}]`;
                    console.log('Failed send request to Telegram API:', error);
                    return resolve([]);
                }

                return resolve(response.result);
            })
        })
    }

    // Main point to parse incoming requests from Telegram Servers
    parseRequest(request){
        const isCallbackQuery = request.callback_query || false;
        const isTextMessage = request.message || request.edited_message || false;

        // Callback Queries from clients
        if (isCallbackQuery) {
            let query = request.callback_query;
            let entry = this.callbackQueries.find(el => el.data === query.data);
            if (entry) {
                entry.callback(query);
            }
            return;
        }

        if (isTextMessage) {
            let message = request.message || request.edited_message;
            let entry = this.textMessages.find(el => el.data === message.text);
            if (entry) {
                entry.callback(message);
            }
        }
    }

    enrollQuery(q, f) {
        this.callbackQueries.push({data: q, callback: f});
    }

    enrollText(text, f) {
        this.textMessages.push({data: text, callback: f});
    }

    /*
     * Telegram Bot API invocation
     */

    startAction (message) {
        let startCommandAnswer = {
            chat_id: message.chat.id,
            text: 'Sorry, I have not greeting message now',
        };
        this.sendMessage(startCommandAnswer);
    }

    helpAction(message) {
        let startCommandAnswer = {
            chat_id: message.chat.id,
            text: 'Sorry, I have not helpful information for you',
        };
        this.sendMessage(startCommandAnswer);
    }

    sendMessage(data){
        this.sendRequest('sendMessage', data)
            .catch(error => {
                console.error('Some error when sendMessage method calling. Cause:', error);
            });
    }

    editMessageText(data) {
        this.sendRequest('editMessageText', data)
            .catch(error => {
                console.error('Some error when editMessageText method calling. Cause:', error);
            });
    }

    answerCallbackQuery(data) {
        this.sendRequest('answerCallbackQuery', data)
            .catch(error => {
                console.error('Some error when answerCallbackQuery method calling. Cause:', error);
            });
    }
}

module.exports = TelegramBot;
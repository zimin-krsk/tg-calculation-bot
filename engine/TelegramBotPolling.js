const TelegramBot = require('./TelegramBot');

class TelegramBotPolling extends TelegramBot {

    constructor(token, timeout) {
        super(token);
        this.polling = {
            enabled: true,
            timeout: timeout || 200,
            scheduler: null,
            params: {}
        };
    }

    get isPolling() {
        return this.polling.enabled;
    }

    get isWebHooking() {
        return false;
    }

    start() {
        this.initialize().then(() => {
            console.log('Start polling right now...');
            this.startPolling();
        });
    }

    stop() {
        if (this.isStarted && this.polling.scheduler) {
            clearTimeout(this.polling.scheduler);
        }
    }

    getUpdates() {
        return this.sendRequest('getUpdates', this.polling.params);
    }

    startPolling() {
        this.getUpdates()
            .then(updates => {
                updates.forEach(update => {
                    this.polling.params.offset = update.update_id + 1;
                    this.parseRequest(update);
                });
            })
            .then(() => {
                this.polling.scheduler = setTimeout(() => this.startPolling(), this.polling.timeout);
            })
            .catch(error => {
                console.error('Some error when getUpdates method call. Cause:', error);
            });
    }
}

module.exports = TelegramBotPolling;

const ApiOptions = {
    getUpdates: {
        offset: null,
        limit: null,
        timeout: null
    },

    sendMessage: {
        chat_id: null,
        text: null,
        parse_mode: null,
        disable_web_page_preview: null,
        disable_notification: null,
        reply_to_message_id: null,
        reply_markup: null
    },

    editMessageText: {
        chat_id: null,
        message_id: null,
        inline_message_id: null,
        text: null,
        parse_mode: null,
        disable_web_page_preview: null,
        reply_markup: null
    },

    answerCallbackQuery: {
        callback_query_id: null,
        text: null,
        show_alert: null,
        url: null,
        cache_time: null
    }
};

module.exports = ApiOptions;
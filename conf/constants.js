// App configuration
const PORT = process.env.PORT || 5000;

// Bot authentication
const RELEASE_BOT_TOKEN = '537983199:AAE4wthgVYelGHPg3di39vbWVsK-q8a8ZqQ';
const DEV_BOT_TOKEN = null;

// For security URL in telegram webHooks
const ROUTE_SECURITY_TOKEN = '';

module.exports = {
    PORT,
    RELEASE_BOT_TOKEN,
    DEV_BOT_TOKEN,
    ROUTE_SECURITY_TOKEN
};
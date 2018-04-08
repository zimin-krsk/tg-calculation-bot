let express = require('express');
let router = express.Router();
const {bot} = require('../');

// To prevent call failed instance
router.use(function isBotResponsible(req, res, next) {
    if (!bot || bot.isStopped) {
        return;
    }

    if (!req.body.message) {
        return;
    }

    console.log('request', req.body);
    next();
});

// If we here, that bot instance is working
router.post('/', function(request, response) {
    try {
        bot.parseRequest(request.body.message);
        response.send('ok');
    } catch (error) {
        console.log('Throw error: ', error);
        response.end();
    }
});

module.exports = router;

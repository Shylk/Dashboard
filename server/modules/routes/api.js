const express = require('express');
const router = express.Router();

const youtubeRouter = require('./api/youtube');
const twitchRouter = require('./api/twitch');
const redditRouter = require('./api/reddit');
const steamRouter = require('./api/steam');
const weatherRouter = require('./api/weather');
const covidRouter = require('./api/covid');

router.use('/youtube', youtubeRouter);
router.use('/twitch', twitchRouter);
router.use('/reddit', redditRouter);
router.use('/steam', steamRouter);
router.use('/weather', weatherRouter);
router.use('/covid', covidRouter);

module.exports = router;

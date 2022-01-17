const express = require('express');
const router = express.Router();
const axios = require('axios').default;

require('dotenv').config();

router.get('/:city/:units', async (req, res) => {
    try {
        let response = await axios({
            method: 'GET',
            url:
                'http://api.openweathermap.org/data/2.5/weather?q=' +
                req.params.city +
                '&appid=' +
                process.env.WEATHER_KEY +
                '&units=' +
                req.params.units, //metric
        });
        res.send({ data: response.data.main.temp });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const axios = require('axios').default;

require('dotenv').config();

const config = {
    client: {
        id: process.env.TWITCH_APP_ID,
        secret: process.env.TWITCH_SECRET_ID,
    },
    auth: {
        tokenHost: 'https://twitch.tv',
    },
    accessToken: 'undefined',
};

async function generateAccessToken() {
    try {
        let res = await axios({
            method: 'POST',
            url:
                'https://id.twitch.tv/oauth2/token?client_id=' +
                process.env.TWITCH_APP_ID +
                '&client_secret=' +
                process.env.TWITCH_SECRET +
                '&grant_type=client_credentials&scope=user_read',
        });
        config.accessToken = res.data.access_token;
    } catch (e) {
        throw { message: 'failed to generate access token' };
    }
}

router.get('/user/:user_login', async (req, res) => {
    try {
        config.accessToken == 'undefined'
            ? await generateAccessToken()
            : config.accessToken;
        let response = await axios({
            method: 'GET',
            url:
                'https://api.twitch.tv/helix/streams?user_login=' +
                req.params.user_login,
            headers: {
                Authorization: 'Bearer ' + config.accessToken,
                'Client-ID': process.env.TWITCH_APP_ID,
            },
        });
        if (response.data.data.length === 0)
            res.send({ data: 'User is offline' });
        else res.send({ data: response.data.data[0].viewer_count });
    } catch (e) {
        res.status(500).send({ message: 'Internal error' });
    }
});

router.get('/stream/:language', async (req, res) => {
    try {
        config.accessToken == 'undefined'
            ? await generateAccessToken()
            : config.accessToken;
        let response = await axios({
            method: 'GET',
            url:
                'https://api.twitch.tv/helix/streams/?language=' +
                req.params.language,
            headers: {
                Authorization: 'Bearer ' + config.accessToken,
                'Client-ID': process.env.TWITCH_APP_ID,
            },
        });
        if (response.data.data.length === 0) {
            res.send({ data: 'Invalid language' });
        } else {
            let topStream = [];
            for (i = 0; i < 10; i++) {
                topStream.push({
                    userName: response.data.data[i].user_name,
                    viewerCount: response.data.data[i].viewer_count,
                });
            }
            res.send({ data: topStream });
        }
    } catch (e) {
        res.status(500).send({ message: 'Internal error' });
    }
});

router.get('/game/:name', async (req, res) => {
    try {
        config.accessToken == 'undefined'
            ? await generateAccessToken()
            : config.accessToken;
        let responseGameID = await axios({
            method: 'GET',
            url:
                'https://api.twitch.tv/helix/games?name=' +
                req.params.name +
                '&limit=5',
            headers: {
                Authorization: 'Bearer ' + config.accessToken,
                'Client-ID': process.env.TWITCH_APP_ID,
            },
        });
        if (responseGameID.data.data.length === 0) {
            res.send({ data: 'Game not found' });
            return;
        }
        let gameID = await responseGameID.data.data[0].id;
        let response = await axios({
            method: 'GET',
            url: 'https://api.twitch.tv/helix/streams?game_id=' + gameID,
            headers: {
                Authorization: 'Bearer ' + config.accessToken,
                'Client-ID': process.env.TWITCH_APP_ID,
            },
        });
        let topStream = [];
        for (i = 0; i < 10; i++) {
            topStream.push({
                userName: response.data.data[i].user_name,
                viewerCount: response.data.data[i].viewer_count,
            });
        }
        res.send({ data: topStream });
    } catch (e) {
        res.status(500).send({ message: 'Internal error' });
    }
});

module.exports = router;

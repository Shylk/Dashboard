const express = require('express');
const router = express.Router();
const axios = require('axios').default;
var querystring = require('querystring');

require('dotenv').config();

const config = {
    accessToken: 'undefined',
};

async function generateAccessToken() {
    try {
        let response = await axios({
            method: 'POST',
            url: 'https://www.reddit.com/api/v1/access_token?grant_type=password&username=Shylk94&password=azertyuiop',
            auth: {
                username: process.env.REDDIT_SCRIPT_APP_ID,
                password: process.env.REDDIT_SCRIPT_APP_SECRET,
            },
        });
        config.accessToken = response.data.access_token;
        // console.log(config.accessToken);
    } catch (e) {
        throw { message: 'failed to generate access token' };
    }
}

router.get('/auth/user', async (req, res) => {
    try {
        res.redirect(
            `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_APP_ID}&response_type=code&state=RANDOMSTRING&redirect_uri=http://localhost:3000/dashboard/&duration=temporary&scope=read,identity,history`
        );
    } catch (e) {
        res.status(500).send({ message: 'Internal error' });
    }
});

router.post('/auth/generateToken/:codeReddit', async (req, res) => {
    try {
        console.log('TRYING TO GET REDDIT ACCESS TOKEN');
        let response = await axios({
            method: 'POST',
            url: `https://www.reddit.com/api/v1/access_token?grant_type=authorization_code&code=${req.params.codeReddit}&redirect_uri=http://localhost:3000/dashboard/`,
            auth: {
                username: process.env.REDDIT_APP_ID,
                password: process.env.REDDIT_APP_SECRET,
            },
        });

        res.send({ data: response.data.access_token });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal error' });
    }
});

router.get('/comment/:limit/:token', async (req, res) => {
    try {
        let getName = await axios({
            method: 'GET',
            url: `https://oauth.reddit.com/api/v1/me`,
            headers: {
                Authorization: `Bearer ${req.params.token}`,
            },
        });
        let response = await axios({
            method: 'GET',
            url: `https://oauth.reddit.com/user/${getName.data.name}/comments?limit=${req.params.limit}`,
            headers: {
                Authorization: `Bearer ${req.params.token}`,
            },
        });
        res.send(response.data.data.children);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal error' });
    }
});

router.get('/:subredditName', async (req, res) => {
    try {
        generateAccessToken();
        let response = await axios({
            method: 'GET',
            url:
                'https://oauth.reddit.com/r/' +
                req.params.subredditName +
                '/about',
            headers: {
                Authorization: 'Bearer ' + config.accessToken,
            },
        });
        if (response.data.length === 0)
            res.send({ data: 'Subreddit does not exist or verify syntax' });
        res.send({
            name: response.data.data.display_name,
            active_user: response.data.data.active_user_count,
            total_user: response.data.data.subscribers,
        });
    } catch (e) {
        res.status(500).send({ message: 'Internal error' });
    }
});

module.exports = router;

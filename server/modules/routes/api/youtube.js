const express = require('express');
const router = express.Router();
const axios = require('axios').default;

require('dotenv').config();

/* Youtube Sub count */
router.get('/channel/:name', async (req, res) => {
    try {
        const userName = req.params.name;
        const sub = await axios.get(
            'https://www.googleapis.com/youtube/v3/channels',
            {
                params: {
                    part: 'statistics',
                    forUsername: userName,
                    key: process.env.KEY_YTB_API,
                },
            }
        );
        if (Object.keys(sub.data).length !== 0 && sub.data.items)
            //if Object is not empty, the user was found
            res.send({
                data: sub.data.items[0].statistics.subscriberCount,
            });
        else {
            //then the user was not found
            const userChannel = await axios.get(
                'https://www.googleapis.com/youtube/v3/search',
                {
                    params: {
                        part: 'snippet',
                        type: 'channel',
                        maxResults: 1,
                        q: userName,
                        key: process.env.KEY_YTB_API,
                    },
                }
            );
            if (userChannel.data.items.length === 0)
                res.status(404).send({ message: 'User not found' });
            else {
                const userChannelId = userChannel.data.items[0].id.channelId;
                const userChannelInfos = await axios.get(
                    'https://www.googleapis.com/youtube/v3/channels',
                    {
                        params: {
                            part: 'statistics',
                            id: userChannelId,
                            key: process.env.KEY_YTB_API,
                        },
                    }
                );
                res.send({
                    data: userChannelInfos.data.items[0].statistics
                        .subscriberCount,
                });
            }
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal error' });
    }
});

/* Youtube Video count */
router.get('/views/:id', async (req, res) => {
    try {
        const views = await axios.get(
            'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' +
                req.params.id +
                '&key=' +
                process.env.KEY_YTB_API
        );
        if (views.data.items.length > 0)
            res.send({ data: views.data.items[0].statistics.viewCount });
        else res.status(404).send({ message: 'Video not found' });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal error' });
    }
});

/* Youtube Video comment */
router.get('/comment/:id/:limit', async (req, res) => {
    try {
        const rawComments = await axios.get(
            'https://www.googleapis.com/youtube/v3/commentThreads?key=' +
                process.env.KEY_YTB_API +
                '&textFormat=plainText&part=snippet&videoId=' +
                req.params.id +
                '&maxResults=' +
                req.params.limit
        );
        const polishedComments = [];
        for (const message of rawComments.data.items) {
            const comment = message.snippet.topLevelComment.snippet;
            polishedComments.push({
                author: comment.authorDisplayName,
                body: comment.textDisplay,
            });
        }
        res.send({ data: polishedComments });
    } catch (e) {
        if (e.reponse && e.response.status === 404)
            res.status(404).send({ message: 'Video not found' });
        else res.status(500).send({ message: 'Internal error' });
    }
});

module.exports = router;

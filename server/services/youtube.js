/* Youtube Sub count */
app.get('/youtube/channel/:name', async (req, res) => {
    const sub = await axios.get(
        'https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=' +
            req.params.name +
            '&fields=items/statistics/subscriberCount&key=' +
            process.env.KEY_YTB_API
    );
    res.send(
        req.params.name +
            ' has ' +
            sub.data.items[0].statistics.subscriberCount +
            ' subscribers'
    );
});

/* Youtube Video count */
app.get('/youtube/views/:id', async (req, res) => {
    const views = await axios.get(
        'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' +
            req.params.id +
            '&key=' +
            process.env.KEY_YTB_API
    );
    res.send('viewCount: ' + views.data.items[0].statistics.viewCount);
});

/* Youtube Video comment */
app.get('/youtube/comment/:id/:limit', async (req, res) => {
    const comment = await axios.get(
        'https://www.googleapis.com/youtube/v3/commentThreads?key=' +
            process.env.KEY_YTB_API +
            '&textFormat=plainText&part=snippet&videoId=' +
            req.params.id +
            '&maxResults=' +
            req.params.limit
    );
    res.send('fetch comment');
});

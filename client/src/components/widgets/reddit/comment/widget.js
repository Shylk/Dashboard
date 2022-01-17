import { Box, List, ListItem, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { Divider } from '@mui/material';
import React from 'react';

import Client from '../../../../misc/utils/customClient';

import GenericWidget from '../../genericWidget';

async function fetchReddit(limit) {
    try {
        console.log('QUERYING BACKEND ENDPOINT REDDIT:');
        if (!localStorage.getItem('redditToken')) return [];
        console.log(
            `/api/reddit/comment/${limit}/${localStorage.getItem(
                'redditToken'
            )}`
        );
        const widgetData = await Client.get(
            `/api/reddit/comment/${limit}/${localStorage.getItem(
                'redditToken'
            )}`
        );
        return widgetData;
    } catch (e) {
        console.log(e);
        return [];
    }
}

const ListOfComments = ({ comments }) => {
    console.log('ALL REDDIT COMMENT');
    if (!Array.isArray(comments)) return;
    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
            }}
        >
            {comments.map((comment) => (
                <React.Fragment>
                    <ListItem alignItems="flex-start" key={comment.data.author}>
                        <ListItemText
                            primary={comment.data.author}
                            secondary={comment.data.body}
                        />
                    </ListItem>
                    <Divider component="li" />
                </React.Fragment>
            ))}
        </List>
    );
};

const RedditCommentWidget = ({ limit, timer }) => {
    const [widgetData, setWidgetData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let data = await fetchReddit(limit);
            setWidgetData(data);
        }
        const interval = setInterval(
            async () => await fetchData(),
            timer * 1000
        );
        fetchData();
        return () => clearInterval(interval);
    }, []);

    return (
        <GenericWidget
            title="My comments"
            height={limit === 1 ? 200 : 130 * limit}
            width={300}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                }}
            >
                <ListOfComments comments={widgetData} />
            </Box>
        </GenericWidget>
    );
};

export default RedditCommentWidget;

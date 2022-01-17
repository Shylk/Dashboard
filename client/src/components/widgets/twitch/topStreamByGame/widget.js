import React from 'react';
import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import {
    Typography,
    ListItemIcon,
    ListItemText,
    ListItem,
    List,
    Divider,
} from '@mui/material';

import Client from '../../../../misc/utils/customClient';
import GenericWidget from '../../genericWidget';
import TwitchLogo from '../assets/twitch_logo.png';
import LiveTvIcon from '@mui/icons-material/LiveTv';

async function fetchTopStreamByGame(game) {
    try {
        const streams = await Client.get(`/api/twitch/game/${game}`);
        return streams.data;
    } catch (e) {
        return '';
    }
}

const ListOfStreams = ({ streams }) => {
    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
            }}
        >
            {streams.map((stream) => (
                <React.Fragment>
                    <ListItem alignItems="flex-start" key={stream.userName}>
                        <ListItemIcon>
                            <LiveTvIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={stream.userName}
                            secondary={`${stream.viewerCount} views`}
                        />
                    </ListItem>
                    <Divider component="li" />
                </React.Fragment>
            ))}
        </List>
    );
};

const FetchedStreamsIsNotAnArray = ({ errorMessage }) => {
    return (
        <React.Fragment>
            <img alt="twitch logo" src={TwitchLogo} style={{ width: 50 }} />
            <Typography fontSize="xx-large" fontWeight={800}>
                {errorMessage}
            </Typography>
        </React.Fragment>
    );
};

const TwitchTopStreamByGameWidget = ({ game, timer }) => {
    const [topStreams, setTopStreams] = useState([]);
    const [widgetHeight, setWidgetHeight] = useState(150);

    useEffect(() => {
        async function fetchData() {
            let data = await fetchTopStreamByGame(game);
            if (Array.isArray(data)) setWidgetHeight(85 * data.length);
            setTopStreams(data);
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
            title={`Top streams for ${game}`}
            height={widgetHeight}
            width={350}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                }}
            >
                {Array.isArray(topStreams) ? (
                    <ListOfStreams streams={topStreams} />
                ) : (
                    <FetchedStreamsIsNotAnArray errorMessage={topStreams} />
                )}
            </Box>
        </GenericWidget>
    );
};

export default TwitchTopStreamByGameWidget;

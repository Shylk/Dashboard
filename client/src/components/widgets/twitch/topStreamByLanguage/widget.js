import React from 'react';
import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemIcon,
    Typography,
} from '@mui/material';
import LiveTvIcon from '@mui/icons-material/LiveTv';

import Client from '../../../../misc/utils/customClient';
import GenericWidget from '../../genericWidget';
import TwitchLogo from '../assets/twitch_logo.png';

async function fetchTopGameByLanguage(language) {
    try {
        const topGames = await Client.get(`/api/twitch/stream/${language}`);
        return topGames.data;
    } catch (e) {
        return [];
    }
}

const ListOfGames = ({ games }) => {
    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
            }}
        >
            {games.map((game) => (
                <React.Fragment>
                    <ListItem alignItems="flex-start" key={game.userName}>
                        <ListItemIcon>
                            <LiveTvIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={game.userName}
                            secondary={`${game.viewerCount} views`}
                        />
                    </ListItem>
                    <Divider component="li" />
                </React.Fragment>
            ))}
        </List>
    );
};

const FetchedGamesIsNotAnArray = ({ errorMessage }) => {
    return (
        <React.Fragment>
            <img alt="twitch logo" src={TwitchLogo} style={{ width: 50 }} />
            <Typography fontSize="xx-large" fontWeight={800}>
                {errorMessage}
            </Typography>
        </React.Fragment>
    );
};

const TwitchTopGameByLanguageWidget = ({ language, timer }) => {
    const [topGames, setTopgames] = useState([]);
    const [widgetHeight, setWidgetHeight] = useState(150);

    useEffect(() => {
        async function fetchData() {
            let data = await fetchTopGameByLanguage(language);
            if (Array.isArray(data)) setWidgetHeight(85 * data.length);
            setTopgames(data);
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
            title={`Top Twitch streams for ${language}`}
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
                {Array.isArray(topGames) ? (
                    <ListOfGames games={topGames} />
                ) : (
                    <FetchedGamesIsNotAnArray errorMessage={topGames} />
                )}
            </Box>
        </GenericWidget>
    );
};

export default TwitchTopGameByLanguageWidget;

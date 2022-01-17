import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Client from '../../../../misc/utils/customClient';
import TwitchLogo from '../assets/twitch_logo.png';

import GenericWidget from '../../genericWidget';

async function fetchViewCount(user) {
    try {
        const nbViews = await Client.get(`/api/twitch/user/${user}`);
        return nbViews.data;
    } catch (e) {
        return 0;
    }
}

const TwitchViewCountWidget = ({ user, timer }) => {
    const [nbViews, setNbViews] = useState();
    useEffect(() => {
        async function fetchData() {
            let data = await fetchViewCount(user);
            setNbViews(data);
        }
        const interval = setInterval(
            async () => await fetchData(),
            timer * 1000
        );
        fetchData();
        return () => clearInterval(interval);
    }, []);

    return (
        <GenericWidget title={`${user} views`} height={150} width={300}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                }}
            >
                <img alt="twitch logo" src={TwitchLogo} style={{ width: 50 }} />
                <Typography fontSize="xx-large" fontWeight={800}>
                    {nbViews}
                </Typography>
            </Box>
        </GenericWidget>
    );
};

export default TwitchViewCountWidget;

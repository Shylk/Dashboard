import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Client from '../../../misc/utils/customClient';
import SmartToyIcon from '@mui/icons-material/SmartToy';

import GenericWidget from '../genericWidget';

async function fetchReddit(name) {
    try {
        const widgetData = await Client.get(`/api/reddit/${name}`);
        return widgetData;
    } catch (e) {
        console.log(e);
        return 'no data';
    }
}

const RedditSubRedditWidget = ({ name, timer }) => {
    const [widgetData, setWidgetData] = useState('Reddit');

    useEffect(() => {
        async function fetchData() {
            let data = await fetchReddit(name);
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
        <GenericWidget title={widgetData.name} height={250} width={450}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                }}
            >
                <SmartToyIcon fontSize="large" sx={{ color: 'Orange' }} />
                <Box>
                    <Typography fontSize="xx-large" fontWeight={800}>
                        {widgetData.active_user} active user
                    </Typography>
                    <Typography fontSize="xx-large" fontWeight={800}>
                        {widgetData.total_user} total user
                    </Typography>
                </Box>
            </Box>
        </GenericWidget>
    );
};

export default RedditSubRedditWidget;

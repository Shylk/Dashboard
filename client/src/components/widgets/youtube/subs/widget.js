import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import numeral from 'numeral';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

import Client from '../../../../misc/utils/customClient';
import GenericWidget from '../../genericWidget';

const getNbSubs = async (channel) => {
    try {
        const subs = await Client.get(`/api/youtube/channel/${channel}`);
        return subs.data;
    } catch (e) {
        //TODO: display correct error message
        return e.message;
    }
};

const YouTubeSubsWidget = ({ channel, timer }) => {
    const [nbSub, setNbSub] = useState(-1);

    useEffect(() => {
        async function fetchData() {
            const subs = await getNbSubs(channel);
            setNbSub(subs);
        }
        const interval = setInterval(
            async () => await fetchData(),
            timer * 1000
        );
        fetchData();
        return () => clearInterval(interval);
    }, []);

    return (
        <GenericWidget title={`${channel} followers`} height={150} width={300}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                }}
            >
                <SubscriptionsIcon fontSize="large" sx={{ color: 'red' }} />
                <Typography fontSize="xx-large" fontWeight={800}>
                    {isNaN(nbSub) ? nbSub : numeral(nbSub).format('0.0a')}
                </Typography>
            </Box>
        </GenericWidget>
    );
};

export default YouTubeSubsWidget;

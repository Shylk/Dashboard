import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import numeral from 'numeral';
import { Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import Client from '../../../../misc/utils/customClient';
import GenericWidget from '../../genericWidget';

const getnbViews = async (video) => {
    try {
        const views = await Client.get(`/api/youtube/views/${video}`);
        return views.data;
    } catch (e) {
        //TODO: display correct error message
        console.log(e);
        return e.message;
    }
};

const YoutubeViewsWidget = ({ video, timer }) => {
    const [nbViews, setNbViews] = useState(-1);

    useEffect(() => {
        async function fetchData() {
            const subs = await getnbViews(video);
            setNbViews(subs);
        }
        const interval = setInterval(
            async () => await fetchData(),
            timer * 1000
        );
        fetchData();
        return () => clearInterval(interval);
    }, []);

    return (
        <GenericWidget title={`${video} views`} height={150} width={300}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                }}
            >
                <VisibilityIcon fontSize="large" sx={{ color: 'blue' }} />
                <Typography fontSize="xx-large" fontWeight={800}>
                    {isNaN(nbViews) ? nbViews : numeral(nbViews).format('0.0a')}
                </Typography>
            </Box>
        </GenericWidget>
    );
};

export default YoutubeViewsWidget;

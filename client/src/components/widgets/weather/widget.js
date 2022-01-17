import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

import Client from '../../../misc/utils/customClient';
import GenericWidget from '../genericWidget';

async function fetchTemperature(city, unit) {
    const type = unit === 'celsius' ? 'metric' : 'imperial';
    try {
        const widgetData = await Client.get(`/api/weather/${city}/${type}`);
        return widgetData.data;
    } catch (e) {
        return 0;
    }
}

const WeatherWidget = ({ city, unit, timer }) => {
    const [widgetData, setWidgetData] = useState('Invalid City');

    useEffect(() => {
        async function fetchData() {
            let data = await fetchTemperature(city, unit);
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
        <GenericWidget title={`${city}`} height={150} width={320}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                }}
            >
                <WbSunnyIcon fontSize="large" sx={{ color: 'orange' }} />
                <Typography fontSize="xx-large" fontWeight={800}>
                    {widgetData} {unit}
                </Typography>
            </Box>
        </GenericWidget>
    );
};

export default WeatherWidget;

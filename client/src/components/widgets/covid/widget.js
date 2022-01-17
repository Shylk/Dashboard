import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import numeral from 'numeral';

import Client from '../../../misc/utils/customClient';
import GenericWidget from '../genericWidget';

async function fetchCovidData(country) {
    try {
        const data = await Client.get(`/api/covid/${country}`);
        return data.data;
    } catch (e) {
        return 0;
    }
}

const CovidTrackerWidget = ({ country, unit, timer }) => {
    const [covidCases, setCovidCases] = useState(0);

    useEffect(() => {
        async function fetchData() {
            let data = await fetchCovidData(country, unit);
            setCovidCases(data);
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
            title={`${country} covid cases`}
            height={150}
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
                <CoronavirusIcon fontSize="large" sx={{ color: 'green' }} />
                <Typography fontSize="xx-large" fontWeight={800}>
                    {isNaN(covidCases)
                        ? covidCases
                        : numeral(covidCases).format('0.0a')}
                </Typography>
            </Box>
        </GenericWidget>
    );
};

export default CovidTrackerWidget;

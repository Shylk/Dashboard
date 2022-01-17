import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Client from '../../../misc/utils/customClient';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import GenericWidget from '../genericWidget';

async function fetchGameNbPlayers(game) {
    try {
        const widgetData = await Client.get(`/api/steam/${game}/`);
        return widgetData;
    } catch (e) {
        return '0 player';
    }
}

const SteamPlayersInGameWidget = ({ game, timer }) => {
    const [widgetData, setWidgetData] = useState({
        game: 'steam',
        players: '',
    });

    useEffect(() => {
        async function fetchData() {
            let data = await fetchGameNbPlayers(game);
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
        <GenericWidget title={widgetData.game} height={150} width={350}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                }}
            >
                <SportsEsportsIcon fontSize="large" sx={{ color: 'Blue' }} />
                <Typography fontSize="xx-large" fontWeight={800}>
                    {widgetData.players} Players
                </Typography>
            </Box>
        </GenericWidget>
    );
};

export default SteamPlayersInGameWidget;

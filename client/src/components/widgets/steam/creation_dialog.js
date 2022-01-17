import WidgetCreationDialog from '../genericCreationDialog';
import { useState } from 'react';
import { TextField, Button, Typography, Slider } from '@mui/material';

import SteamPlayersInGameWidget from './widget';

import Utils from '../../../misc/utils/utils';

const SteamPlayersInGameCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [steamGame, setSteamGame] = useState();
    const [timer, setTimer] = useState(30);

    const changeSteamGame = (value) => setSteamGame(value.target.value);
    const handleChangeTimer = (value) => setTimer(value.target.value);

    const submitCreation = () => {
        Utils.saveWidget(widgetId, { game: steamGame, timer });
        submitCallback(
            <SteamPlayersInGameWidget game={steamGame} timer={timer} />
        );
    };

    return (
        <WidgetCreationDialog
            title="Steam active player"
            closeCallback={closeCallback}
            isOpen={isOpen}
        >
            <TextField
                label="Steam Game ID"
                onChange={changeSteamGame}
                margin="normal"
                required
            />
            <Typography id="track-inverted-slider" gutterBottom mt={2}>
                Refresh timer (seconds)
            </Typography>
            <Slider
                aria-label="Temperature"
                valueLabelDisplay="auto"
                defaultValue={30}
                step={1}
                min={2}
                max={60}
                onChange={handleChangeTimer}
            />
            <Button variant="contained" onClick={submitCreation} sx={{ mt: 2 }}>
                Create
            </Button>
        </WidgetCreationDialog>
    );
};

export default SteamPlayersInGameCreation;

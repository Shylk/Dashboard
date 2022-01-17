import WidgetCreationDialog from '../../genericCreationDialog';
import { useState } from 'react';
import { TextField, Button, Slider, Typography } from '@mui/material';
import TwitchTopStreamByGameWidget from './widget';

import Utils from '../../../../misc/utils/utils';

const TwitchTopStreamByGameCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [twitchGame, setTwitchGame] = useState();
    const [timer, setTimer] = useState(30);

    const changeTwitchGame = (value) => setTwitchGame(value.target.value);
    const handleChangeTimer = (value) => setTimer(value.target.value);

    const submitCreation = () => {
        Utils.saveWidget(widgetId, { game: twitchGame, timer });
        submitCallback(
            <TwitchTopStreamByGameWidget game={twitchGame} timer={timer} />
        );
    };

    return (
        <WidgetCreationDialog
            title="Twitch Top Stream By Game"
            closeCallback={closeCallback}
            isOpen={isOpen}
        >
            <TextField
                label="Game"
                onChange={changeTwitchGame}
                margin="normal"
                required
            />
            <Typography gutterBottom mt={2}>
                Refresh timer (seconds)
            </Typography>
            <Slider
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

export default TwitchTopStreamByGameCreation;

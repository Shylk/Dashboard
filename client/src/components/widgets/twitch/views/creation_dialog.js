import WidgetCreationDialog from '../../genericCreationDialog';
import { useState } from 'react';
import { TextField, Button, Slider, Typography } from '@mui/material';
import TwitchViewCountWidget from './widget';

import Utils from '../../../../misc/utils/utils';

const TwitchUserViewersCountCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [twitchLogin, setTwitchLogin] = useState();
    const [timer, setTimer] = useState(30);

    const changeTwitchLogin = (value) => setTwitchLogin(value.target.value);
    const handleChangeTimer = (value) => setTimer(value.target.value);

    const submitCreation = () => {
        Utils.saveWidget(widgetId, { user: twitchLogin, timer });
        submitCallback(
            <TwitchViewCountWidget user={twitchLogin} timer={timer} />
        );
    };
    return (
        <WidgetCreationDialog
            title="Twitch User Viewers Count"
            closeCallback={closeCallback}
            isOpen={isOpen}
        >
            <TextField
                label="Twitch Login"
                onChange={changeTwitchLogin}
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

export default TwitchUserViewersCountCreation;

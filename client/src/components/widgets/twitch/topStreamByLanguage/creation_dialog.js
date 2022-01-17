import WidgetCreationDialog from '../../genericCreationDialog';
import { useState } from 'react';
import { TextField, Button, Slider, Typography } from '@mui/material';
import TwitchTopGameByLanguageWidget from './widget';

import Utils from '../../../../misc/utils/utils';

const TwitchTopGameByLanguageCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [twitchLanguage, setTwitchLanguage] = useState();
    const [timer, setTimer] = useState(30);

    const changeTwitchLanguage = (e) => setTwitchLanguage(e.target.value);
    const handleChangeTimer = (e) => setTimer(e.target.value);

    const submitCreation = () => {
        Utils.saveWidget(widgetId, { language: twitchLanguage, timer });
        submitCallback(
            <TwitchTopGameByLanguageWidget
                language={twitchLanguage}
                timer={timer}
            />
        );
    };

    return (
        <WidgetCreationDialog
            title="Twitch Top Game By Language"
            closeCallback={closeCallback}
            isOpen={isOpen}
        >
            <TextField
                label="Language"
                onChange={changeTwitchLanguage}
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

export default TwitchTopGameByLanguageCreation;

import WidgetCreationDialog from '../genericCreationDialog';
import { useState } from 'react';
import { TextField, Button, Typography, Slider } from '@mui/material';
import Utils from '../../../misc/utils/utils';
import CovidTrackerWidget from './widget';

const CovidTrackerCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [country, setCountry] = useState();
    const [timer, setTimer] = useState(30);

    const handleChangeCountry = (value) => setCountry(value.target.value);
    const handleChangeTimer = (value) => setTimer(value.target.value);

    const submitCreation = () => {
        Utils.saveWidget(widgetId, { country: country, timer });
        submitCallback(<CovidTrackerWidget country={country} timer={timer} />);
    };

    return (
        <WidgetCreationDialog
            title="Covid case tracker"
            closeCallback={closeCallback}
            isOpen={isOpen}
        >
            <TextField
                label="Country"
                onChange={handleChangeCountry}
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

export default CovidTrackerCreation;

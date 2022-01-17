import React, { useState } from 'react';
import { TextField, Checkbox, Button } from '@mui/material';
import { FormControlLabel, Grid, Typography, Slider } from '@mui/material';

import WidgetCreationDialog from '../genericCreationDialog';
import WeatherWidget from './widget';

import Utils from '../../../misc/utils/utils';

const WeatherCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [celsiusChecked, setCelsiusChecked] = useState(true);
    const [farenheitChecked, setFarenheitChecked] = useState(false);
    const [weatherCity, setWeatherCity] = useState();
    const [timer, setTimer] = useState(30);

    const changeWeatherCity = (value) => setWeatherCity(value.target.value);
    const handleTimerChange = (value) => setTimer(value.target.value);

    const toggleCelsiusChecked = () => {
        const isChecked = celsiusChecked;
        setCelsiusChecked(!isChecked);
        setFarenheitChecked(isChecked);
    };

    const toggleFarenheitChecked = () => {
        const isChecked = farenheitChecked;
        setFarenheitChecked(!isChecked);
        setCelsiusChecked(isChecked);
    };

    const submitCreation = () => {
        const unit = farenheitChecked ? 'farehnheit' : 'celsius';
        Utils.saveWidget(widgetId, { city: weatherCity, unit, timer });
        submitCallback(
            <WeatherWidget city={weatherCity} unit={unit} timer={timer} />
        );
    };

    return (
        <WidgetCreationDialog
            title="Weather Widget"
            isOpen={isOpen}
            closeCallback={closeCallback}
            submitCallback={submitCallback}
        >
            <TextField
                label="City"
                onChange={changeWeatherCity}
                margin="normal"
                required
            />
            <Grid container>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox checked={celsiusChecked} />}
                        label="Celsius"
                        onClick={toggleCelsiusChecked}
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox checked={farenheitChecked} />}
                        label="Farenheit"
                        onClick={toggleFarenheitChecked}
                    />
                </Grid>
            </Grid>
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
                onChange={handleTimerChange}
            />
            <Button variant="contained" onClick={submitCreation} sx={{ mt: 2 }}>
                Create
            </Button>
        </WidgetCreationDialog>
    );
};

export default WeatherCreation;

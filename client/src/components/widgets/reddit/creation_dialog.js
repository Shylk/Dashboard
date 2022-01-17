import WidgetCreationDialog from '../genericCreationDialog';
import { useState } from 'react';
import { TextField, Button, Typography, Slider } from '@mui/material';

import RedditSubRedditWidget from './widget';

import Utils from '../../../misc/utils/utils';

const RedditSubRedditCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [Subreddit, setSubreddit] = useState();
    const [timer, setTimer] = useState(30);

    const changeSubreddit = (value) => setSubreddit(value.target.value);
    const handleChangeTimer = (value) => setTimer(value.target.value);

    const submitCreation = () => {
        Utils.saveWidget(widgetId, { subreddit: Subreddit, timer });
        submitCallback(
            <RedditSubRedditWidget name={Subreddit} timer={timer} />
        );
    };

    return (
        <WidgetCreationDialog
            title="Subreddit details"
            closeCallback={closeCallback}
            isOpen={isOpen}
        >
            <TextField
                label="Subreddit name"
                onChange={changeSubreddit}
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

export default RedditSubRedditCreation;

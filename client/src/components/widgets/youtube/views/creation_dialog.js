import WidgetCreationDialog from '../../genericCreationDialog';
import { TextField, Button, Slider, Typography, Alert } from '@mui/material';
import { useState } from 'react';

import MediaLinkOrIdSelection from '../mediaTypeSelection';
import YoutubeViewsWidget from './widget';

import Utils from '../../../../misc/utils/utils';

const YoutubeViewsCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [inputType, setInputType] = useState('link');
    const [timer, setTimer] = useState(30);
    const [video, setVideo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChangeVideo = (e) => setVideo(e.target.value);
    const handleChangeTimer = (e) => setTimer(e.target.value);

    const submitWidgetCreation = () => {
        const youtubePrefixUrl = 'https://www.youtube.com/watch?v=';
        let inputVideo = video;

        if (inputVideo.includes(youtubePrefixUrl))
            inputVideo = inputVideo.slice(youtubePrefixUrl.length);
        if (video.length === 0) setErrorMessage('Missing fields');
        else if (inputType === 'link' && !video.includes(youtubePrefixUrl))
            setErrorMessage('Invalid url');
        else if (inputType === 'id' && video.includes(youtubePrefixUrl))
            setErrorMessage('Invalid id');
        else {
            Utils.saveWidget(widgetId, { video: inputVideo, timer });
            submitCallback(
                <YoutubeViewsWidget video={inputVideo} timer={timer} />
            );
        }
    };
    return (
        <WidgetCreationDialog
            title="Youtube Views Count Widget"
            closeCallback={closeCallback}
            isOpen={isOpen}
        >
            {errorMessage && (
                <Alert severity="error" sx={{ m: 2 }}>
                    {errorMessage}
                </Alert>
            )}
            <MediaLinkOrIdSelection
                callback={(type) => setInputType(type)}
                selectedButton={inputType === 'link' ? 0 : 1}
            />

            <TextField
                label={`Video ${inputType}`}
                margin="normal"
                onChange={handleChangeVideo}
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
            <Button
                variant="contained"
                onClick={submitWidgetCreation}
                sx={{ mt: 2 }}
            >
                Create
            </Button>
        </WidgetCreationDialog>
    );
};

export default YoutubeViewsCreation;

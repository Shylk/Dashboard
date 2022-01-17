import WidgetCreationDialog from '../../genericCreationDialog';
import { TextField, Button, Slider, Typography, Alert } from '@mui/material';
import { useState } from 'react';

import YoutubeCommentsWidget from './widget';
import MediaLinkOrIdSelection from '../mediaTypeSelection';

import Utils from '../../../../misc/utils/utils';

const YoutubeCommentsCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [inputType, setInputType] = useState('link');
    const [timer, setTimer] = useState(30);
    const [video, setVideo] = useState('');
    const [nbCommentsToDisplay, setNbCommentsToDisplay] = useState(3);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChangeVideo = (e) => setVideo(e.target.value);
    const handleChangeTimer = (e) => setTimer(e.target.value);

    const handleChangeNbCommentsToDisplay = (e) => {
        setNbCommentsToDisplay(e.target.value);
    };

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
            Utils.saveWidget(widgetId, {
                video: inputVideo,
                limit: nbCommentsToDisplay,
                timer,
            });
            submitCallback(
                <YoutubeCommentsWidget
                    video={inputVideo}
                    timer={timer}
                    limit={nbCommentsToDisplay}
                />
            );
        }
    };

    return (
        <WidgetCreationDialog
            title="Youtube Comments Widget"
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
            <Typography gutterBottom mt={2}>
                Number of comments to display
            </Typography>
            <Slider
                valueLabelDisplay="auto"
                defaultValue={3}
                step={1}
                min={1}
                max={5}
                onChange={handleChangeNbCommentsToDisplay}
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

export default YoutubeCommentsCreation;

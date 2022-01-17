import WidgetCreationDialog from '../../genericCreationDialog';
import { TextField, Button, Slider, Typography, Alert } from '@mui/material';
import { useState } from 'react';

import MediaLinkOrIdSelection from '../mediaTypeSelection';
import YouTubeSubsWidget from './widget';

import Utils from '../../../../misc/utils/utils';

const YoutubeSubsCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [channel, setChannel] = useState('');
    const [timer, setTimer] = useState(30);
    const [inputType, setInputType] = useState('link');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChangeChannel = (e) => setChannel(e.target.value);
    const handleChangeTimer = (e) => setTimer(e.target.value);

    const submitWidgetCreation = () => {
        const youtubePrefixUrl = 'https://www.youtube.com/';
        let inputChannel = channel;

        if (inputChannel.includes(youtubePrefixUrl))
            inputChannel = inputChannel.slice(
                inputChannel.lastIndexOf('/') + 1
            );
        console.log(inputChannel);
        if (channel.length === 0) setErrorMessage('Missing fields');
        else if (inputType === 'link' && !channel.includes(youtubePrefixUrl))
            setErrorMessage('Invalid url');
        else if (inputType === 'id' && channel.includes(youtubePrefixUrl))
            setErrorMessage('Invalid channel name');
        else {
            Utils.saveWidget(widgetId, { channel: inputChannel, timer });
            submitCallback(
                <YouTubeSubsWidget channel={inputChannel} timer={timer} />
            );
        }
    };

    return (
        <WidgetCreationDialog
            title="Youtube Subscribers Count Widget"
            closeCallback={closeCallback}
            isOpen={isOpen}
        >
            {errorMessage && (
                <Alert severity="error" sx={{ m: 2 }}>
                    {errorMessage}
                </Alert>
            )}
            <MediaLinkOrIdSelection
                callback={(type) => {
                    type === 'link'
                        ? setInputType('link')
                        : setInputType('name');
                }}
                selectedButton={inputType === 'link' ? 0 : 1}
                buttonNames={['From link', 'From name']}
            />
            <TextField
                label={`Channel ${inputType}`}
                margin="normal"
                onChange={handleChangeChannel}
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

export default YoutubeSubsCreation;

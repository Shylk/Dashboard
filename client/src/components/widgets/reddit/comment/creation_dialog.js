import WidgetCreationDialog from '../../genericCreationDialog';
import { useState } from 'react';
import { Button, Slider, Typography } from '@mui/material';
import RedditCommentWidget from './widget';

import Utils from '../../../../misc/utils/utils';

const RedditCommentCreation = ({
    isOpen,
    closeCallback,
    submitCallback,
    widgetId,
}) => {
    const [limit, setLimit] = useState(3);
    const [timer, setTimer] = useState(30);

    const handleChangeLimit = (value) => setLimit(value.target.value);

    const handleChangeTimer = (value) => setTimer(value.target.value);

    const submitCreation = () => {
        Utils.saveWidget(widgetId, { limit, timer });
        submitCallback(<RedditCommentWidget limit={limit} timer={timer} />);
    };

    return (
        <WidgetCreationDialog
            title="Subreddit details"
            closeCallback={closeCallback}
            isOpen={isOpen}
        >
            <Typography gutterBottom mt={2}>
                Number of comments
            </Typography>
            <Slider
                valueLabelDisplay="auto"
                defaultValue={3}
                step={1}
                min={1}
                max={10}
                onChange={handleChangeLimit}
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

export default RedditCommentCreation;

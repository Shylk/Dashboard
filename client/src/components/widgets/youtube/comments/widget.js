import { Button, List, ListItem, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    Divider,
    Dialog,
    DialogTitle,
    Slide,
    TextField,
    Typography,
    Slider,
} from '@mui/material';
import React from 'react';
import Client from '../../../../misc/utils/customClient';
import GenericWidget from '../../genericWidget';
import { Box } from '@mui/system';

const getComments = async (video, limit) => {
    try {
        const comments = await Client.get(
            `/api/youtube/comment/${video}/${limit}`
        );
        return comments.data;
    } catch (e) {
        //TODO: display correct error message
        return e.message;
    }
};

const ListOfComments = ({ comments }) => {
    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
            }}
        >
            {comments.map((comment) => (
                <React.Fragment>
                    <ListItem alignItems="flex-start" key={comment.author}>
                        <ListItemText
                            primary={comment.author}
                            secondary={comment.body}
                        />
                    </ListItem>
                    <Divider component="li" />
                </React.Fragment>
            ))}
        </List>
    );
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SettingsDialog = ({ open, settings, closeCallback }) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={closeCallback}
        >
            <DialogTitle>{`${settings.video} comments settings`}</DialogTitle>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    p: 3,
                }}
            >
                <TextField
                    label={`Video ${settings.video}`}
                    margin="normal"
                    // onChange={handleChangeVideo}
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
                    // onChange={handleChangeNbCommentsToDisplay}
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
                    sx={{ mb: 5 }}
                />
                <Button variant="contained" color="primary" sx={{ mb: 2 }}>
                    Save
                </Button>
                <Button variant="contained" color="error">
                    Remove
                </Button>
            </Box>
        </Dialog>
    );
};

const YoutubeCommentsWidget = ({ video, timer, limit }) => {
    const [comments, setComments] = useState([]);
    const [showSettingsDialog, setshowSettingsDialog] = useState(false);

    useEffect(() => {
        async function fetchVideoComments() {
            const subs = await getComments(video, limit);
            setComments(subs);
        }
        const interval = setInterval(
            async () => await fetchVideoComments(),
            timer * 1000
        );
        fetchVideoComments();
        return () => clearInterval(interval);
    }, []);

    return (
        <GenericWidget
            title={`${video} comments`}
            height={150 * limit}
            width={300}
            callback={() => setshowSettingsDialog(true)}
        >
            {/* START SETTINGS WINDOW */}
            {/* <SettingsDialog
                open={showSettingsDialog}
                settings={{ video, timer, limit }}
                closeCallback={() => setshowSettingsDialog(false)}
            /> */}
            {/* END SETTINGS WINDOW */}

            <ListOfComments comments={comments} />
        </GenericWidget>
    );
};

export default YoutubeCommentsWidget;

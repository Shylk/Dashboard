import { Box } from '@mui/system';
import { Paper, Typography, IconButton } from '@mui/material';
import Draggable from 'react-draggable';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

const GenericWidget = (props) => {
    return (
        <Draggable>
            <Box
                component={Paper}
                elevation={3}
                sx={{ height: props.height, width: props.width, p: 2 }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography fontSize="large">{props.title}</Typography>
                    <IconButton onClick={props.callback}>
                        <SettingsIcon fontSize="medium" />
                    </IconButton>
                    <IconButton onClick={props.callback}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                {props.children}
            </Box>
        </Draggable>
    );
};

export default GenericWidget;

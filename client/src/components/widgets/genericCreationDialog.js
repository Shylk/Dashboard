import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { Box } from '@mui/system';

const WidgetCreationDialog = (props) => {
    return (
        <Dialog onClose={props.closeCallback} open={props.isOpen}>
            <DialogTitle>{props.title}</DialogTitle>
            <Box
                px={2}
                mb={3}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {props.children}
            </Box>
        </Dialog>
    );
};

export default WidgetCreationDialog;

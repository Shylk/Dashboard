import { Button, Grid } from '@mui/material';
import { useState } from 'react';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

const MediaLinkOrIdSelection = ({
    callback,
    selectedButton,
    buttonNames = ['From link', 'From id'],
}) => {
    const linkButtonDisabledByDefault = selectedButton === 0 ? false : true;

    const [linkDisabled, setlinkDisabled] = useState(
        linkButtonDisabledByDefault
    );
    const [idDisabled, setIdDisabled] = useState(!linkButtonDisabledByDefault);

    const toggleButtons = () => {
        if (linkDisabled) {
            callback('link');
        } else {
            callback('id');
        }
        setlinkDisabled(!linkDisabled);
        setIdDisabled(!idDisabled);
    };

    return (
        <Grid
            container
            sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
            }}
        >
            <Grid item>
                <Button
                    variant="outlined"
                    startIcon={<InsertLinkIcon />}
                    onClick={() => toggleButtons()}
                    color={linkDisabled ? 'notSelected' : 'primary'}
                >
                    {buttonNames[0]}
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="outlined"
                    startIcon={<FingerprintIcon />}
                    onClick={() => toggleButtons()}
                    color={idDisabled ? 'notSelected' : 'primary'}
                >
                    {buttonNames[1]}
                </Button>
            </Grid>
        </Grid>
    );
};

export default MediaLinkOrIdSelection;

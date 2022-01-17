import Client from '../../misc/utils/customClient';
import { widgetsByServices } from '../dashboard/widgets';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Card } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Checkbox } from '@mui/material';
import { red } from '@mui/material/colors';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const services = [
    {
        title: 'Weather',
        image: 'https://media.istockphoto.com/photos/blue-sky-with-cloud-picture-id1151056603?b=1&k=20&m=1151056603&s=170667a&w=0&h=gWVMsxMs2fnQHazBiqmbH-ccWKoYlTNOOg7iihVmex0=',
    },
    {
        title: 'YouTube',
        image: 'https://images.unsplash.com/photo-1541877944-ac82a091518a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    },
    {
        title: 'Reddit',
        image: 'https://images.unsplash.com/photo-1616509091215-57bbece93654?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    },
    {
        title: 'Steam',
        image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',
    },

    {
        title: 'Twitch',
        image: 'https://images.unsplash.com/photo-1598550480917-1c485268676e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },

    {
        title: 'Covid 19',
        image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80',
    },
];

const steps = ['Sign up', 'Subscribe to services', 'Customize your dashboard'];

const Subscribe = () => {
    const [error, setError] = useState(false);
    const [redirect, setRedirect] = useState('');
    const [checkBoxState, setCheckBoxState] = useState({
        Weather: false,
        YouTube: false,
        Reddit: false,
        Steam: false,
        Twitch: false,
        'Covid 19': false,
    });

    const handleChange = (event) => {
        setCheckBoxState({
            ...checkBoxState,
            [event.target.name]: event.target.checked,
        });
    };

    useEffect(() => {
        (async function () {
            try {
                const userSubs = await Client.get('/user/subscriptions');
                if (userSubs.data.length > 0) setRedirect('/dashboard');
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    const submitSubscriptions = async () => {
        try {
            const servicesId = [];
            const existingServices = widgetsByServices.map(
                (service) => service.name
            );
            for (const name in checkBoxState) {
                if (checkBoxState[name] === true) {
                    servicesId.push(existingServices.indexOf(name) + 1);
                }
            }
            if (servicesId.length === 0) {
                //the user did not choose any service
                setError(true);
                return;
            }
            await Client.post('/user/subscribe', { services: servicesId });
            if (checkBoxState.Reddit)
                window.open(
                    'http://localhost:8080/api/reddit/auth/user',
                    '_self'
                );
            else setRedirect('/dashboard');
        } catch (e) {
            console.log(e);
        }
    };

    if (redirect) return <Navigate to={redirect} />;
    return (
        <div>
            <Box sx={{ width: '100%', mb: 5 }}>
                <Stepper activeStep={1} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <Button
                endIcon={<NavigateNextIcon />}
                variant="contained"
                onClick={submitSubscriptions}
            >
                Next
            </Button>
            {error && <h2>Please select at least on subject</h2>}
            <Grid container spacing={4}>
                {services.map((service) => (
                    <Grid item key={service.title}>
                        <Card sx={{ width: 345 }}>
                            <CardHeader title={service.title} />
                            <CardMedia
                                component="img"
                                height="194"
                                image={service.image}
                            />
                            <CardActions disableSpacing>
                                <Checkbox
                                    icon={<FavoriteBorder />}
                                    checkedIcon={<Favorite />}
                                    checked={checkBoxState[service.title]}
                                    name={service.title}
                                    onClick={handleChange}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: red[500],
                                        },
                                    }}
                                />
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Subscribe;

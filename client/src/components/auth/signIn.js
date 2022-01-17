import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Alert,
    AlertTitle,
    CssBaseline,
    Grid,
    Paper,
    Link,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/system';
import FacebookIcon from '@mui/icons-material/Facebook';

import Client from '../../misc/utils/customClient';

const UserSignIn = () => {
    const theme = createTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorUi, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState('');

    useEffect(() => {
        (async function () {
            try {
                await Client.get('/user/current-user');
                setRedirect('/dashboard');
            } catch (e) {} //then the user is logged in - this line will not be executed if he is not,it will throw in the client
        })();
    }, []);

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const loginUser = async () => {
        //TODO: handle empty fields
        try {
            const res = await Client.post('/user/sign-in', {
                email: email,
                password: password,
            });
            if (res.token) {
                localStorage.token = res.token;
                localStorage.user = JSON.stringify(res.user);
                setRedirect('/dashboard');
            } else throw { message: 'Processing error' };
        } catch (e) {
            const errorMessage = e.message ?? 'Internal error';
            setErrorMessage(errorMessage);
            setError(true);
        }
    };

    const loginUserWithFacebook = async () => {
        window.open('http://localhost:8080/user/facebook-sign-in', '_self');
    };

    if (redirect) return <Navigate to={redirect} />;
    return (
        <ThemeProvider theme={theme}>
            <Grid container sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2438&q=80)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={24}
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <h1>ClearMind</h1>
                        <Box component="form">
                            {errorMessage && (
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    {errorMessage}
                                </Alert>
                            )}
                            <TextField
                                label="Email"
                                margin="normal"
                                onChange={handleChangeEmail}
                                required
                                fullWidth
                                error={errorUi}
                            />
                            <TextField
                                label="Password"
                                margin="normal"
                                onChange={handleChangePassword}
                                required
                                fullWidth
                                type="password"
                                error={errorUi}
                            />
                            <Button
                                id="login-submit-button"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3 }}
                                onClick={loginUser}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3 }}
                                onClick={loginUserWithFacebook}
                                startIcon={<FacebookIcon />}
                            >
                                Connect with Meta
                            </Button>
                        </Box>
                        <Link href="/user/sign-up" sx={{ my: 3 }}>
                            I don't have an account
                        </Link>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default UserSignIn;

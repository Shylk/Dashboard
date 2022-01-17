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

//TODO: use same components as signIn to avoid useless code
const UserSignUp = () => {
    const theme = createTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(' ');
    const [errorUi, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState('');

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    useEffect(() => {
        (async function () {
            try {
                await Client.get('/user/current-user');
                setRedirect('/dashboard');
            } catch (e) {}
        })();
    }, []);

    const loginUser = async () => {
        //TODO: handle empty fields
        try {
            const res = await Client.post('/user/sign-up', {
                email: email,
                password: password,
                username: username,
            });
            if (res.token) {
                localStorage.token = res.token;
                localStorage.user = JSON.stringify(res.user);
                setRedirect('/subscribe');
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
                            'url(https://images.unsplash.com/photo-1521336575822-6da63fb45455?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80)',
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
                        <h1>Welcome to ClearMind !</h1>
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
                                label="Username"
                                margin="normal"
                                onChange={handleChangeUsername}
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
                                Sign Up
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
                        <Link href="/user/sign-in" sx={{ my: 3 }}>
                            I already have an account
                        </Link>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default UserSignUp;

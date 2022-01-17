import './App.css';
import UserSignIn from './components/auth/signIn';
import UserSignUp from './components/auth/signUp';
import Dashboard from './components/dashboard/dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import Subscribe from './components/auth/servicesSubscribe';
import { AdminLogin, AdminPanel } from './components/dashboard/admin';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#42a5f5',
        },
        secondary: {
            main: '#f50057',
        },
        notSelected: {
            main: '#A0A0A0',
        },
    },
});

const HomeRedirection = () => {
    return (
        <div>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={<Navigate to="/user/sign-in" />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user/sign-in" element={<UserSignIn />} />
                <Route path="/user/sign-in/admin" element={<AdminLogin />} />
                <Route path="/user/sign-up" element={<UserSignUp />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <HomeRedirection />
            </div>
        </ThemeProvider>
    );
}

export default App;

import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import Client from '../../misc/utils/customClient';
import { Navigate } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogged, setIsLogged] = useState(false);

    const handleChangeUsername = (e) => setUsername(e.target.value);
    const handleChangePassword = (e) => setPassword(e.target.value);

    const login = async () => {
        (async function () {
            try {
                const res = await Client.post('/user/sign-in/admin', {
                    username,
                    password,
                });
                localStorage.setItem('adminToken', res.token);
                setIsLogged(true);
            } catch (e) {
                console.log(e);
            }
        })();
    };
    if (isLogged) return <Navigate to={'/admin'} />;
    return (
        <div>
            <TextField
                label="Username"
                margin="normal"
                onChange={handleChangeUsername}
                required
                fullWidth
            />
            <TextField
                label="Password"
                margin="normal"
                onChange={handleChangePassword}
                required
                fullWidth
                type="password"
            />
            <Button variant="contained" onClick={login}>
                Log in
            </Button>
        </div>
    );
};

const formatUsers = (users) => {
    const formated = [];
    for (const user of users) {
        user.services = user.service.map((service) => service.name);
        user.nbServices = user.services.length;
        user.widgets = user.widget.map((widget) => widget.widget.name);
        user.nbWidgets = user.widget.length;
        formated.push(user);
    }
    return formated;
};

const AdminPanel = () => {
    const [isLogged, setIsLogged] = useState(true);
    let [users, setUsers] = useState([]);
    const [rowSelected, setRowSelected] = useState(false);
    const [refetchUsers, setRefetchUsers] = useState(false);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'email', headerName: 'Email', width: 170 },
        { field: 'username', headerName: 'Username', width: 130 },
        { field: 'role', headerName: 'Role', width: 130 },
        {
            field: 'nbServices',
            headerName: 'Nb Services',
            type: 'number',
            width: 130,
        },
        { field: 'services', headerName: 'Subbed Services', width: 200 },
        {
            field: 'nbWidgets',
            headerName: 'Nb Widgets Created',
            type: 'number',
            width: 200,
        },
        { field: 'widgets', headerName: 'Created Widgets', width: 200 },
    ];

    useEffect(() => {
        if (!localStorage.getItem('adminToken')) {
            setIsLogged(false);
            return;
        }
        (async function () {
            const allUsers = await Client.get('/user/admin/all-users', true);
            const formatedUser = formatUsers(allUsers.data);
            setUsers(formatedUser);
        })();
    }, [refetchUsers]);

    const deleteUser = async () => {
        try {
            const res = await fetch(
                'http://localhost:8080/user/admin/delete-user',
                {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${localStorage['adminToken']}`,
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({ id: rowSelected.id }),
                }
            );
            if (res.status !== 200) throw res;
            setRefetchUsers(!refetchUsers);
        } catch (e) {
            console.log(e);
        }
    };

    const deleteUserWidgets = async () => {
        try {
            const res = await fetch(
                'http://localhost:8080/user/admin/delete-user-widgets',
                {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${localStorage['adminToken']}`,
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({ id: rowSelected.id }),
                }
            );
            if (res.status !== 200) throw res;
            setRefetchUsers(!refetchUsers);
        } catch (e) {
            console.log(e);
        }
    };

    const logout = async () => {
        localStorage.removeItem('adminToken');
        setIsLogged(false);
    };

    if (!isLogged) return <Navigate to={'/user/sign-in'} />;
    return (
        <div style={{ height: 400, width: '100%' }}>
            {rowSelected && (
                <Box sx={{ mb: 5 }}>
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={deleteUser}
                        variant="contained"
                        sx={{ mr: 2 }}
                        color="error"
                    >
                        Delete User
                    </Button>
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={deleteUserWidgets}
                        variant="contained"
                    >
                        Delete User Widgets
                    </Button>
                </Box>
            )}
            <DataGrid
                rows={users}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={(e) => setRowSelected(e.row)}
            />
            <Button endIcon={<LogoutIcon />} onClick={logout}>
                Logout
            </Button>
        </div>
    );
};

export { AdminLogin, AdminPanel };

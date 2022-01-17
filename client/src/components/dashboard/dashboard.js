import React, { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';
import ServicesDrawer from './servicesDrawer';
import { widgetsByServices, availableWidgets } from './widgets';
import { Navigate } from 'react-router';
import Client from '../../misc/utils/customClient';

import CustomAppBar from './appBar';

const WidgetRender = ({ widgets = [] }) => {
    return widgets.map((widget) => widget);
};

const Dashboard = () => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const toggleDrawer = () => setDrawerIsOpen(!drawerIsOpen);

    const [widgetCreationDialog, setWidgetCreationDialog] = useState({});
    const [widgetDialogIsOpen, setWidgetDialogIsOpen] = useState(true);

    const [createdWidgets, setCreatedWidgets] = useState([]);

    const [userIsSignedIn, setUserIsSignedIn] = useState(true);
    const [user, setUser] = useState({});

    const [subscribedServices, setSubscribedServices] = useState([]);
    const redditTokenSet = false;

    const getSavedWidgets = async () => {
        try {
            const widgets = await Client.get('/user/saved-widgets');
            const savedWidgets = [];
            for (const widget of widgets.data) {
                const params = JSON.parse(widget.params);
                savedWidgets.push(
                    availableWidgets[widget.id - 1].create(params)
                );
            }
            setCreatedWidgets(savedWidgets);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        (async function () {
            try {
                const currentUser = await Client.get('/user/current-user');
                await getSavedWidgets();
                setUser(currentUser.data);
                setSubscribedServices(
                    currentUser.data.services.map(
                        (subedService) => widgetsByServices[subedService.id - 1]
                    )
                );
            } catch (e) {
                setUserIsSignedIn(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async function () {
            console.log('HELLO');
            try {
                if (redditTokenSet) return;

                var url = window.location;
                console.log(url.search);
                if (url === null || !url.search.includes('code')) return;
                var access_token = new URLSearchParams(url.search).get('code');

                const response = await Client.post(
                    `/api/reddit/auth/generateToken/${access_token}`
                );
                localStorage.setItem('redditToken', response.data);
                window.location = '/dashboard';
                redditTokenSet = true;
            } catch (e) {
                console.log(e);
                return 'undefined';
            }
        })();
    }, [redditTokenSet]);

    const logoutUser = async () => {
        await Client.post('/user/logout');
        if (localStorage['token']) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setUserIsSignedIn(false);
    };

    const deleteWidgets = async () => {
        try {
            //TODO: switch to delete method
            toggleDrawer();
            await Client.post('/user/delete-saved-widgets');
            await getSavedWidgets();
        } catch (e) {
            console.log(e);
        }
    };

    if (!userIsSignedIn) return <Navigate to={'/user/sign-in'} />;
    return (
        <div>
            <CssBaseline />
            <CustomAppBar
                user={user.username}
                callback={logoutUser}
                drawerOpen={toggleDrawer}
            />
            <ServicesDrawer
                isOpen={drawerIsOpen}
                services={subscribedServices}
                callback={(selectedWidget = {}) => {
                    toggleDrawer();
                    if (selectedWidget.hasOwnProperty('creationComponent')) {
                        setWidgetCreationDialog(selectedWidget);
                        setWidgetDialogIsOpen(true);
                    }
                }}
                closeCallback={() => toggleDrawer()}
                deleteCallback={deleteWidgets}
            />
            {widgetCreationDialog.creationComponent &&
                widgetCreationDialog.creationComponent(
                    widgetDialogIsOpen,
                    () => setWidgetDialogIsOpen(false),
                    (widget) => {
                        createdWidgets.push(widget);
                        setCreatedWidgets(createdWidgets);
                        setWidgetDialogIsOpen(false);
                    }
                )}
            <WidgetRender widgets={createdWidgets} />
        </div>
    );
};

export default Dashboard;

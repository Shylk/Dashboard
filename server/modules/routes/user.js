const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const randomstring = require('randomstring');
const dotenv = require('dotenv');
dotenv.config();

const allWidgets = require('../config/widgets');

const saltRounds = 10;

module.exports = (prisma) => {
    const router = express.Router();

    router.get(
        '/facebook-sign-in',
        passport.authenticate('facebook', { scope: 'email' })
    );

    router.get(
        '/facebook-sign-in/callback',
        passport.authenticate('facebook', {
            successRedirect: 'http://localhost:3000/subscribe',
            failureRedirect: 'http://localhost:3000',
        })
    );

    router.get('/current-user', async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: req.user.email,
                },
                include: {
                    service: true,
                },
            });
            res.send({
                data: {
                    username: user.username,
                    services: user.service,
                },
            });
        } catch (e) {
            console.log(e);
            res.status(500).send({ message: 'Internal error' });
        }
    });

    router.post('/logout', (req, res) => {
        if (req.user.sessionType === 'cookie') {
            req.logout();
            req.session.destroy();
        }
        res.send({ data: 'successs' });
    });

    router.post('/sign-in', async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: req.body.email,
                },
            });
            if (user) {
                const match = await bcrypt.compare(
                    req.body.password,
                    user.password
                );
                if (match) {
                    const jwtoken = jwt.sign(
                        user,
                        process.env.JWT_PRIVATE_KEY,
                        {
                            expiresIn: '1h',
                        }
                    );
                    res.json({
                        token: jwtoken,
                        user: { username: user.username },
                    });
                } else throw 'Invalid password';
            } else {
                res.status(404).send({
                    message: 'Invalid user',
                });
            }
        } catch (e) {
            res.status(500).send({ message: e });
        }
    });

    router.post('/sign-up', async (req, res) => {
        try {
            if (!req.body.username || !req.body.password || !req.body.email) {
                throw 'Request body is missing a field';
            }
            const user = await prisma.user.findUnique({
                where: {
                    email: req.body.email,
                },
            });
            if (user) {
                res.status(500).send({
                    message: `An account linked to this email already exists`,
                });
            } else {
                const userFacebookId =
                    req.body.facebookId || randomstring.generate(); //create a fake facebookId so the @unique constraint is respected
                const hash = await bcrypt.hash(req.body.password, saltRounds);
                const user = await prisma.user.create({
                    data: {
                        email: req.body.email,
                        username: req.body.username,
                        password: hash,
                        facebookId: userFacebookId,
                    },
                });
                const jwtoken = jwt.sign(user, process.env.JWT_PRIVATE_KEY, {
                    expiresIn: '1h',
                });
                res.json({ token: jwtoken, user: { username: user.username } });
            }
        } catch (e) {
            res.status(500).send({ message: 'Internal error' });
        }
    });

    router.get('/subscriptions', async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: req.user.email,
                },
                include: {
                    service: true,
                },
            });
            res.status(200).send({ data: user.service });
        } catch (e) {
            console.log(e);
            res.status(500).send({ message: 'Internal error' });
        }
    });

    router.get('/saved-widgets', async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: req.user.email,
                },
                include: {
                    widget: true,
                },
            });
            const widgets = [];
            for (const widget of user.widget) {
                widgets.push({ id: widget.widgetId, params: widget.params });
            }
            res.send({ data: widgets });
        } catch (e) {
            res.status(500).send({ message: 'Internal error' });
        }
    });

    router.post('/save-widget', async (req, res) => {
        try {
            const widget = req.body;
            const userSubedServices = await prisma.user.findUnique({
                where: {
                    email: req.user.email,
                },
                include: {
                    service: true,
                },
            });
            if (
                userSubedServices.service.find(
                    (sb) => sb.id === allWidgets[widget.id - 1].serviceId
                )
            ) {
                await prisma.user.update({
                    where: {
                        email: req.user.email,
                    },
                    data: {
                        widget: {
                            create: {
                                widget: {
                                    connect: { id: widget.id },
                                },
                                params: widget.params,
                            },
                        },
                    },
                });
                res.send({ data: 'success' });
            } else
                res.status(500).send({
                    message: 'You are not subscribed to the widget service',
                });
        } catch (e) {
            console.log(e);
            res.status(500).send({ message: 'Internal error' });
        }
    });

    router.post('/delete-saved-widgets', async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: req.user.email,
                },
                include: {
                    widget: true,
                },
            });
            if (user) {
                for (const widget of user.widget) {
                    await prisma.userWidget.delete({
                        where: {
                            id: widget.id,
                        },
                    });
                }
                res.send({ data: 'success' });
            } else {
                res.status(500).send({ message: 'User not found' });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send('Internal error');
        }
    });

    router.post('/subscribe', async (req, res) => {
        const arrayOfServicesIdObjects = req.body.services.map((serviceId) => ({
            id: serviceId,
        }));
        try {
            await prisma.user.update({
                where: {
                    email: req.user.email,
                },
                data: {
                    service: {
                        connect: arrayOfServicesIdObjects,
                    },
                },
            });
            res.status(200).send({ data: 'Success' });
        } catch (e) {
            console.log(e);
            res.status(500).send({ message: 'Internal error' });
        }
    });

    router.post('/sign-in/admin', async (req, res) => {
        try {
            const user = await prisma.admin.findUnique({
                where: {
                    username: req.body.username,
                },
            });
            if (user) {
                const match = await bcrypt.compare(
                    req.body.password,
                    user.password
                );
                if (match) {
                    console.log(user);
                    const jwtoken = jwt.sign(
                        user,
                        process.env.JWT_PRIVATE_KEY,
                        {
                            expiresIn: '1h',
                        }
                    );
                    res.json({
                        token: jwtoken,
                        user: { username: user.username },
                    });
                } else throw 'Invalid password';
            } else {
                res.status(404).send({
                    message: 'Invalid user',
                });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send({ message: e });
        }
    });

    router.get('/admin/all-users', async (req, res) => {
        try {
            const users = await prisma.user.findMany({
                include: {
                    service: true,
                    widget: {
                        include: {
                            widget: true,
                        },
                    },
                },
            });
            res.send({ data: users });
        } catch (e) {
            console.log(e);
            res.status(500).send('Internal error');
        }
    });

    router.delete('/admin/delete-user', async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.body.id,
                },
                include: {
                    widget: true,
                },
            });
            if (user) {
                for (const widget of user.widget) {
                    await prisma.userWidget.delete({
                        where: {
                            id: widget.id,
                        },
                    });
                }
                await prisma.user.delete({
                    where: {
                        id: req.body.id,
                    },
                });
                res.send({ data: 'success' });
            } else {
                res.status(500).send({ message: 'User not found' });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send('Internal error');
        }
    });

    router.delete('/admin/delete-user-widgets', async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.body.id,
                },
                include: {
                    widget: true,
                },
            });
            if (user) {
                for (const widget of user.widget) {
                    await prisma.userWidget.delete({
                        where: {
                            id: widget.id,
                        },
                    });
                }
                res.send({ data: 'success' });
            } else {
                res.status(500).send({ message: 'User not found' });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send('Internal error');
        }
    });

    return router;
};

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const passport = require('passport');
require('./modules/config/passport')(prisma);

require('dotenv').config();

const userRouter = require('./modules/routes/user')(prisma);
const apiRouter = require('./modules/routes/api');

const app = express();
const port = process.env.SERVER_PORT || 4000;

const tokenAuthMiddleware = (req, res, next) => {
    try {
        if (req.url === '/reddit/auth/user') return next();
        if (req.user) {
            req.user.sessionType = 'cookie';
            next();
        } else {
            const jwToken = req.headers['authorization'].slice(
                'Bearer '.length
            );
            const user = jwt.verify(jwToken, process.env.JWT_PRIVATE_KEY);
            req.user = user;
            req.user.sessionType = 'jwt';
            if (req.url.includes('/admin/') && user.role !== 'admin')
                res.status(500).send({ message: 'Invalid token' });
            else next();
        }
    } catch (e) {
        res.status(500).send({ message: 'Invalid token' });
    }
};

app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
);
app.use(
    '/user',
    (req, res, next) => {
        if (!req.url.includes('sign')) tokenAuthMiddleware(req, res, next);
        else next();
    },
    userRouter
);

app.use('/api', tokenAuthMiddleware, apiRouter);

app.post('/verify-token', tokenAuthMiddleware, (req, res) => {
    res.status(200).send({ data: 'valid token' });
});

app.get('/about.json', (req, res) => {
    res.sendFile(__dirname + '/about.json');
});

app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
);

const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
require('dotenv').config();

module.exports = (prisma) => {
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: '/user/facebook-sign-in/callback',
                profileFields: ['id', 'displayName', 'email'],
            },
            async function (token, accessToken, profile, done) {
                try {
                    const currentUser = await prisma.user.findUnique({
                        where: {
                            facebookId: profile.id,
                        },
                    });
                    if (currentUser) {
                        return done(null, currentUser);
                    } else {
                        const newUser = await prisma.user.create({
                            data: {
                                facebookId: profile._json.id,
                                email: profile._json.email,
                                username: profile._json.name,
                                password: '',
                            },
                        });
                        return done(null, newUser);
                    }
                } catch (e) {
                    return done(e);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            done(null, user);
        } catch (e) {
            done(new Error('Failed to deserialize an user'));
        }
    });

    return passport;
};

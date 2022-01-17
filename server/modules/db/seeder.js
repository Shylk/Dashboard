const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
require('dotenv').config();

const widgets = [
    {
        name: 'weather',
        nbParams: 3,
        serviceId: 1,
    },
    {
        name: 'youtube_channel_subscribers',
        nbParams: 2,
        serviceId: 2,
    },
    {
        name: 'youtube_video_views',
        nbParams: 2,
        serviceId: 2,
    },
    {
        name: 'youtube_video_comments',
        nbParams: 3,
        serviceId: 2,
    },
    {
        name: 'reddit_hot_posts',
        nbParams: 2,
        serviceId: 3,
    },
    {
        name: 'reddit_my_comments',
        nbParams: 2,
        serviceId: 3,
    },
    {
        name: 'steam_number_players',
        nbParams: 2,
        serviceId: 4,
    },
    {
        name: 'twitch_user_viewers',
        nbParams: 2,
        serviceId: 5,
    },
    {
        name: 'twitch_top_stream_by_language',
        nbParams: 2,
        serviceId: 5,
    },
    {
        name: 'twitch_top_stream_by_game',
        nbParams: 2,
        serviceId: 5,
    },
    {
        name: 'covid_tracker_by_country',
        nbParams: 2,
        serviceId: 6,
    },
];

const services = [
    {
        name: 'weather',
    },
    {
        name: 'youtube',
    },
    {
        name: 'reddit',
    },
    {
        name: 'steam',
    },
    {
        name: 'twitch',
    },
    {
        name: 'covid',
    },
];

(async () => {
    try {
        const admins = [
            {
                username: 'ilias',
                password: await bcrypt.hash('ilias-dashboard-123', 10),
                role: 'admin',
            },
            {
                username: 'christophe',
                password: await bcrypt.hash('chris-dashboard-123', 10),
                role: 'admin',
            },
        ];

        await prisma.service.createMany({ data: services });
        for (const widget of widgets) {
            await prisma.widget.create({
                data: {
                    name: widget.name,
                    nbParams: widget.nbParams,
                    service: {
                        connect: {
                            id: widget.serviceId,
                        },
                    },
                },
            });
        }
        await prisma.admin.createMany({
            data: admins,
        });
        await prisma.$disconnect();
        console.log('DB SEED DONE');
    } catch (e) {
        console.log(e);
    }
})();

import WeatherCreation from '../widgets/weather/creation_dialog';

import RedditSubRedditCreation from '../widgets/reddit/creation_dialog';

import SteamPlayersInGameCreation from '../widgets/steam/creation_dialog';
import YoutubeViewsCreation from '../widgets/youtube/views/creation_dialog';
import YoutubeSubsCreation from '../widgets/youtube/subs/creation_dialog';
import YoutubeCommentsCreation from '../widgets/youtube/comments/creation_dialog';
import TwitchUserViewersCountCreation from '../widgets/twitch/views/creation_dialog';
import TwitchTopStreamByGameCreation from '../widgets/twitch/topStreamByGame/creation_dialog';
import TwitchTopGameByLanguageCreation from '../widgets/twitch/topStreamByLanguage/creation_dialog';
import CovidTrackerCreation from '../widgets/covid/creation_dialog';
import RedditCommentCreation from '../widgets/reddit/comment/creation_dialog';

import WeatherWidget from '../widgets/weather/widget';
import YouTubeSubsWidget from '../widgets/youtube/subs/widget';
import YoutubeCommentsWidget from '../widgets/youtube/comments/widget';
import YoutubeViewsWidget from '../widgets/youtube/views/widget';
import SteamPlayersInGameWidget from '../widgets/steam/widget';
import TwitchViewCountWidget from '../widgets/twitch/views/widget';
import TwitchTopGameByLanguageWidget from '../widgets/twitch/topStreamByLanguage/widget';
import TwitchTopStreamByGameWidget from '../widgets/twitch/topStreamByGame/widget';
import CovidTrackerWidget from '../widgets/covid/widget';
import RedditSubRedditWidget from '../widgets/reddit/widget';
import RedditCommentWidget from '../widgets/reddit/comment/widget';

const availableWidgets = [
    {
        name: 'weather',
        nbParams: 3,
        create: ({ city, unit, timer }) => (
            <WeatherWidget city={city} unit={unit} timer={timer} />
        ),
    },
    {
        name: 'youtube channel subscribers',
        nbParams: 2,
        create: ({ channel, timer }) => (
            <YouTubeSubsWidget channel={channel} timer={timer} />
        ),
    },
    {
        name: 'youtube video views',
        nbParams: 2,
        create: ({ video, timer }) => (
            <YoutubeViewsWidget video={video} timer={timer} />
        ),
    },
    {
        name: 'youtube video comments',
        nbParams: 3,
        create: ({ video, limit, timer }) => (
            <YoutubeCommentsWidget video={video} timer={timer} limit={limit} />
        ),
    },
    {
        name: 'reddit hot posts',
        nbParams: 2,
        create: ({ subreddit, timer }) => (
            <RedditSubRedditWidget name={subreddit} timer={timer} />
        ),
    },
    {
        name: 'reddit my comments',
        nbParams: 2,
        create: ({ limit, timer }) => (
            <RedditCommentWidget limit={limit} timer={timer} />
        ),
    },
    {
        name: 'steam number players',
        nbParams: 2,
        create: ({ game, timer }) => (
            <SteamPlayersInGameWidget game={game} timer={timer} />
        ),
    },
    {
        name: 'twitch user viewers',
        nbParams: 2,
        create: ({ user, timer }) => (
            <TwitchViewCountWidget user={user} timer={timer} />
        ),
    },
    {
        name: 'twitch top stream by language',
        nbParams: 2,
        create: ({ language, timer }) => (
            <TwitchTopGameByLanguageWidget language={language} timer={timer} />
        ),
    },
    {
        name: 'twitch top stream by game',
        nbParams: 2,
        create: ({ game, timer }) => (
            <TwitchTopStreamByGameWidget game={game} timer={timer} />
        ),
    },
    {
        name: 'covid country tracker',
        nbParams: 2,
        create: ({ country, timer }) => (
            <CovidTrackerWidget country={country} timer={timer} />
        ),
    },
];

const widgetsByServices = [
    {
        name: 'Weather',
        widgets: [
            {
                name: 'Temperature',
                argType: 'input',
                argName: 'city',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <WeatherCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={1}
                    />
                ),
            },
        ],
    },
    {
        name: 'YouTube',
        widgets: [
            {
                name: 'Channel subscribers',
                argType: 'input',
                argName: 'channel',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <YoutubeSubsCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={2}
                    />
                ),
            },
            {
                name: 'Video views',
                argType: 'input',
                argName: 'Video',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <YoutubeViewsCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={3}
                    />
                ),
            },
            {
                name: 'Video comments',
                argType: 'input',
                argName: 'video',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <YoutubeCommentsCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={4}
                    />
                ),
            },
        ],
    },
    {
        name: 'Reddit',
        widgets: [
            {
                name: 'Subreddit details',
                argType: 'input',
                argName: 'subreddit',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <RedditSubRedditCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={5}
                    />
                ),
            },
            {
                name: 'My comments',
                argType: 'input',
                argName: 'subreddit',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <RedditCommentCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={6}
                    />
                ),
            },
        ],
    },
    {
        name: 'Steam',
        widgets: [
            {
                name: 'Number player',
                argType: 'input',
                argName: 'gameID',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <SteamPlayersInGameCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={7}
                    />
                ),
            },
        ],
    },
    {
        name: 'Twitch',
        widgets: [
            {
                name: 'User Viewers Count',
                argType: 'input',
                argName: 'userLogin',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <TwitchUserViewersCountCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={8}
                    />
                ),
            },
            {
                name: 'Top Stream By Language',
                argType: 'input',
                argName: 'language',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <TwitchTopGameByLanguageCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={9}
                    />
                ),
            },
            {
                name: 'Top Stream By Game',
                argType: 'input',
                argName: 'game',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <TwitchTopStreamByGameCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={10}
                    />
                ),
            },
        ],
    },
    {
        name: 'Covid 19',
        widgets: [
            {
                name: 'Covid tracker by country',
                argType: 'input',
                argName: 'country',
                creationComponent: (isOpen, closeCallback, submitCallback) => (
                    <CovidTrackerCreation
                        isOpen={isOpen}
                        closeCallback={closeCallback}
                        submitCallback={submitCallback}
                        widgetId={11}
                    />
                ),
            },
        ],
    },
];

export { widgetsByServices, availableWidgets };

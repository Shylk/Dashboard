const express = require('express');
const router = express.Router();
const axios = require('axios').default;

require('dotenv').config();

var map = {
    730: 'Counter-Strike: Global Offensive',
    578080: 'PUBG: BATTLEGROUNDS',
    570: 'Dota 2',
    1097150: 'Fall Guys: Ultimate Knockout',
    1174180: 'Red Dead Redemption 2',
    1172470: 'Apex Legends',
    271590: 'Grand Theft Auto V',
    1569040: 'Football Manager 2022 ',
    238960: 'Warframe',
    292030: 'The Witcher 3: Wild Hunt',
};

router.get('/:appid', async (req, res) => {
    try {
        const nbPlayer = await axios.get(
            'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=' +
                req.params.appid
        );
        // if (nbPlayer.data.response.player_count == 0) {
        //     return (res.send({
        //         game: 'Error',
        //         players: 0,
        //     });
        // } else {
        res.send({
            game: map[req.params.appid],
            players: nbPlayer.data.response.player_count,
        });
        // }
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal error' });
    }
});

module.exports = router;

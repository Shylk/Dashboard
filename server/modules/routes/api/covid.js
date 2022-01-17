const express = require('express');
const router = express.Router();
const api = require('novelcovid');

router.get('/:country', async (req, res) => {
    try {
        const result = await api.countries({ country: req.params.country });
        if (result.message) res.send({ data: 'Country not found' });
        else res.send({ data: result.cases });
    } catch (e) {
        res.status(500).send('Internal error');
    }
});

module.exports = router;

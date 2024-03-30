const express = require('express')
const router = express()
const contentBased = require('../services/contentBased')
const Geo = require('../services/Geo')

router.get('/fetch/geo', async (req, res) =>
    await contentBased.popularBatch([undefined])
                      .then(rec => res.json(rec))
                      .catch(err => console.log(err))
)

router.get('/fetch/:longitude/:latitude/:distance', async (req, res) => {
    const geo = new Geo(req.params['longitude'], req.params['latitude'], req.params['distance'])
    await contentBased.popularBatch([geo])
                      .then(rec => res.json(rec))
                      .catch(err => console.log(err))
})

module.exports = router;

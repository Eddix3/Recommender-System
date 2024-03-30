const express = require('express');
const router = express();
const Review = require('../models/review');
const contentBased = require('../services/contentBased');
const collaborative = require('../services/collaborative');
const RecommendationsCF = require('../models/collRecomm');
const Geo = require('../services/Geo')

router.get('/get/:userId/', async (req, res) =>
    await contentBased.getRecommendations(req.params['userId'])
                      .then(rec => res.json(rec))
                      .catch(err => console.log(err))
);


router.get('/get/:userId/:longitude/:latitude/:distance/', async (req, res) => {
    const geo = new Geo(req.params['longitude'], req.params['latitude'], req.params['distance'])
    await contentBased.getRecommendations(req.params['userId'], geo)
                      .then(rec => res.json(rec))
                      .catch(err => console.log(err))
})

router.get('/fetch/:userId/', async (req, res) => {
    await contentBased.computeRecommendations(req.params['userId'])
        .then(async () =>
            await contentBased.getRecommendations(req.params['userId']).then(rec => res.json(rec)))
        .catch(err => console.log(err))
})

router.get('/fetch/:userId/:longitude/:latitude/:distance/', async (req, res) => {
    const geo = new Geo(req.params['longitude'], req.params['latitude'], req.params['distance'])
    await contentBased.computeRecommendations(req.params['userId'], geo)
        .then(async () =>
            await contentBased.getRecommendations(req.params['userId'], geo).then(rec => res.json(rec)))
        .catch(err => console.log(err))
})

// get back all Reviews
router.get('/', async (req, res) =>
    await Review.find()
        .then(u => res.json(u))
        .catch(err => res.json({ message: err }))
);

module.exports = router;

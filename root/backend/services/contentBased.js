const sim = require('compute-cosine-similarity')
const co = require('co')
const ContRecomm = require('../models/contRecomm')
const CONFIG = require('../config/config.json')
const dbAccess = require('./dbAccess');
require('./Geo')

/**
 * The minimum amount of recommendations (if possible) even if
 * said recommendations aren't above SIM_ACCEPT_THRESHOLD
 * <br>
 * Set to 0, in order to only filter recommendations above SIM_ACCEPT_THRESHOLD
 * @type {number}
 */
const MIN_ENTRIES = CONFIG.minEntries || 50

/**
 * Every similarity above this threshold gets accepted, even if MIN_ENTRIES
 * is reached. The value of similarities are between [1, 0], where 1 indicates a perfect
 * match and 0 a total miss
 * <br>
 * Set to 1, in order to only accept only MIN_ENTRIES recommendations
 * @type {number}
 */
const SIM_ACCEPT_THRESHOLD = CONFIG.simAcceptThreshold || 0.9

/**
 * Every similarity below this threshold gets discarded, even if MIN_ENTRIES
 * hasn't been reached. The value fo similarities are between [1, 0], where 1 indicates
 * a perfect match and 0 a total miss

 * @type {number}
 */
const SIM_DISCARD_THRESHOLD = CONFIG.simDiscardThreshold || 0.6

/**
 * returns the time passed between start and end in seconds
 * -> for logging
 *
 * @param {Date} start
 * @param {Date} end
 * @returns {String} the passed time in seconds
 */
function timePassed(start, end) {
    let timeDiff = end - start
    timeDiff /= 1000 // to seconds
    return `${timeDiff} seconds`
}

/**
 * returns recommendations from the DB of the specified user at the specified geolocation
 * (!!assumes recommendations are present!!)
 * <br>
 * if no geolocation is specified only "online" recommendations are returned
 *
 * @param {String} userId
 * @param  {Geo. | undefined} geo
 * @returns {Promise<String[]>} list of business_ids
 */
async function getRecommendations(userId, geo = undefined) {
    console.log(`Cont: UID: ${userId} - getting Cont-Recomms from DB`)
    // filter the right element
    const filter = {user_id: userId}
    // if geo is undefined, look up "online" recommendations
    if (typeof geo === 'undefined') {
        filter.online_only = true
    } else {
        // noinspection JSUnresolvedFunction
        filter.geocode = geo.toGeoFilter()
    }
    return await dbAccess.getRecommendations(filter)
}

/**
 * computes the recommendations of the given user at the specified geolocation
 * <br>
 * if no geolocation is specified only "online" recommendations are returned
 *
 * @param {String} userId
 * @param {Geo. | undefined} geo
 * @returns {Promise<String[]>} a list of business_ids
 */
async function computeRecommendations(userId, geo = undefined) {
    const startTime = new Date()
    console.log(`Cont: UID: ${userId} - computing Recommendations`)
    const userFeatures = await dbAccess.featureOccurences(userId)
    const alreadyKnown = await dbAccess.getReviewedBusinessIds(userId)
    const filter = {business_id: {$nin: alreadyKnown}}

    if (typeof geo !== "undefined") {
        // noinspection JSUnresolvedFunction
        filter.geocode = geo.toGeoFilter()
    }
    const result = await recommendTo(userId, userFeatures, dbAccess.businessCursor(filter), geo)
    console.log(`Cont: UID: ${userId} - time passed: ${timePassed(startTime, new Date())}`)
    return result
}

/**
 * TODO BUG-FIX: can't fetch online-only events?
 *
 * return the most popular business objects based on their review count from the database
 * (!!assumes recommendations are present!!)
 *
 * @param {Geo. | undefined} geo
 * @returns {Promise<*>} a list of business objects
 */
async function getMostPopular(geo = undefined) {
    // TODO sadly doesn't work
    let filter = {geocode: {$exists: false}} // if undefined, find online only
    if (typeof geo !== "undefined") {
        // noinspection JSUnresolvedFunction
        filter = {geocode: geo.toGeoFilter()}
    }
    return await dbAccess.getMostPopular(filter)
}

/**
 * computes the most popular businesses based on the location and the geolocation
 * <br>
 * if no geolocation is specified only "online" recommendations are computed
 *
 * @param {Geo. | undefined} geo
 * @returns {Promise<void>} a Promise to check if an error occurred
 */
async function computeMostPopular(geo = undefined) {
    const filter = {};
    let geoSchema = undefined // online only
    if (typeof geo !== "undefined") {
        // noinspection JSUnresolvedFunction
        filter.geocode = geo.toGeoFilter()
        // noinspection JSUnresolvedFunction
        geoSchema = geo.toGeoSchema()
    }
    return await dbAccess.findAndSaveMostPopular(filter, MIN_ENTRIES, geoSchema)
}

/**
 *
 * starts a batch run for computing the recommendations of given users and saves the results
 *
 * @param {[String]} userIds
 * @returns {Promise<{message: string}>} a status message
 */
async function userBatch(userIds) {
    const startTime = new Date()
    let status = {message: 'done'}
    console.log(`Cont: user-batch: start`)
    // maybe forEach ...
    for (const uid in userIds) {

        await computeRecommendations(uid).catch(err => {
            console.log(`Cont: UID: ${uid} - error while computing: ${err}`)
            status.message = 'error while computing'
        })
    }
    console.log(`Cont: user-batch: done - time passed: ${timePassed(startTime, new Date())}`)
    console.log(`Cont: user-batch: status: ${status.message}`)
    return status
}

/**
 * starts a batch run for computing the most popular businesses of the given geoJSONs and saves them
 *
 * @param {[Geo.]} geos
 * @returns {Promise<{message: string}>} a status message
 */
async function popularBatch(geos) {
    const startTime = new Date()
    let status = {message: 'done'}
    console.log(`Cont: popular-batch: start`)
    for (const geo of geos) {
        await (computeMostPopular(geo)).catch(err => {
            console.log(`Cont: GEO: ${geo} - error while computing: ${err}`)
            status.message = 'error while computing'
        })
    }
    console.log(`Cont: popular-batch: done - time passed: ${timePassed(startTime, new Date())}`)
    console.log(`Cont: popular-batch: status: ${status.message}`)
    return status;
}

/**
 * calculates the similarity between the categories of the consumed businesses of the user and the categories of a business
 * return a number that can range from 0 to 1, the closer the score gets to 1, the more similar the business
 * @param {Map<String, int>} userFeatures
 * @param  {String[]} targetCategories
 * @return {Number}
 */
function cosineSimilarity(userFeatures, targetCategories) {
    let targetFeatures = new Map()
    userFeatures.forEach((weight, key, ignore) => {
        if (targetCategories.includes(key)) {
            targetFeatures.set(key, weight) // set same value
        } else {
            targetFeatures.set(key, 0)
        }
    })

    let userArr = Array.from(userFeatures.values())
    let targetArr = Array.from(targetFeatures.values())
    let ret = sim(userArr, targetArr)
    return Number.isNaN(ret) ? 0 : ret
}

/**
 * calculated recommendations of the specified user at the specified geolocation

 * @param {String} userId
 * @param {Map<String, Number>} userFeatures - a Map of <keyword, occurrence>
 * @param {QueryCursor<any>} cursor
 * @param {Geo. | undefined} geo
 * @returns {Promise<String[]>} a list of business_ids
 */
async function recommendTo(userId, userFeatures, cursor, geo) {
    return await co(function* () {

        let num = 0 // count all looked at businesses
        let simEntries = new Map()
        let doc = yield cursor.next() // get first element
        // sim returns a value from [1, 0], set it here to "2" so that any found business has a smaller similarity
        let smallestEntry = {bid: '', similarity: 2}

        // fill first MIN_ENTRIES regardless of similarity
        for (let i = 0; doc != null && i < MIN_ENTRIES; doc = yield cursor.next(), i++) {
            num++
            const bid = doc.business_id
            const targetCategories = doc.categories || ""
            const similarity = cosineSimilarity(userFeatures, targetCategories) // heavy operation

            simEntries.set(bid, similarity)
            // keep track of smallest entry
            smallestEntry = smallestEntry.similarity < similarity ? smallestEntry : {
                bid: bid,
                similarity: similarity
            }
        }
        // we have max entries reached, thus we need to compare each new found business with the smallest entry
        // so that our result only contains MIN_ENTRIES or entries with a sim above SIM_ACCEPT_THRESHOLD
        for (; doc != null; doc = yield cursor.next()) {
            num++
            const bid = doc.business_id
            const targetCategories = doc.categories || "" //(doc.categories || '').split(', ')
            const similarity = cosineSimilarity(userFeatures, targetCategories) // heavy operation

            // any business gets accepted if and only if
            //   - the similarity is greater than the current smallest element of our result
            // OR
            //   - the similarity is greater than SIM_LOWER_LIMIT
            if (similarity > smallestEntry.similarity || similarity >= SIM_ACCEPT_THRESHOLD) {
                // if the similarity of the smallestEntry is already greater than SIM_ACCEPT_THRESHOLD
                // just add the found element
                if (smallestEntry.similarity >= SIM_ACCEPT_THRESHOLD) {
                    simEntries.set(bid, similarity)
                    smallestEntry = smallestEntry.similarity <= similarity
                        ? smallestEntry
                        : {bid: bid, similarity: similarity}
                } else { // otherwise delete the smallest element and look up the new smallest
                    simEntries.delete(smallestEntry.bid)
                    simEntries.set(bid, similarity)
                    // TODO is there a better way to get the smallestEntry??
                    let newSmallest = Array.from(simEntries.entries()).sort((a, b) => a[1] - b[1])[0]
                    smallestEntry = {bid: newSmallest[0], similarity: newSmallest[1]}
                }
            }
        }
        simEntries = new Map([...simEntries].filter(([, similarity]) => similarity > SIM_DISCARD_THRESHOLD))
        let result = [...simEntries.keys()]
        const sizeDiff = MIN_ENTRIES - result.length
        console.log(`Cont: UID: ${userId} - total business filtered: ${num}`)
        console.log(`Cont: UID: ${userId} - total matches found:     ${result.length}`)
        if (sizeDiff > 0) {
            console.log(`Cont: UID: ${userId} - filling entries with most popular items`)
            yield getMostPopular(geo)
                .catch(async () => { // if no elements exists within geonear, fetch online instead
                    console.log(`Cont: UID ${userId} - found no entries, filling with most popular online items instead`)
                    await getMostPopular()
                }).then(list => result.push(...list.map(e => e.business_id)))
                .catch(err => console.log(`Cont: UID: ${userId}: - error while computing: ${err}`))
            result = [...new Set(result)].slice(0, MIN_ENTRIES)
        }
        console.log(`Cont: UID: ${userId} - simEntries: ${result.length > 0 ? '' : 'no similarities found'}`)
        simEntries.forEach((v, k) => console.log(`      - BID: ${k} :: SIM: ${v.toFixed(12)}`))
        const recommendation = {
            user_id: userId,
            business_ids: [...result]
        }
        if (typeof geo !== "undefined") {
            // noinspection JSUnresolvedFunction
            recommendation.geocode = geo.toGeoSchema()
        } else {
            recommendation.online_only = true
        }
        // putting this in abAccess doesn't make much sense...
        yield ContRecomm.create(recommendation)
        return result
    })
}

module.exports.getRecommendations = getRecommendations
module.exports.computeRecommendations = computeRecommendations
module.exports.popularBatch = popularBatch
module.exports.userBatch = userBatch

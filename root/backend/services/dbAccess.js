const Review = require('../models/review')
const Business = require('../models/business')
const ContRecomm = require('../models/contRecomm')
const CollRecomm = require('../models/collRecomm')
const MostPopular = require('../models/mostPopular')
const UserData = require('../models/userData');


/** *
 * Finds all reviewed businesses from the specified user and return their IDs in a list
 * @param {String} userId - the user specifying ID
 * @returns {Promise<String[]>} - an Array of Business-IDs
 */
async function getReviewedBusinessIds(userId) {
    return await Review.find({user_id: userId}).lean().then(review => review.map(ele => ele.business_id))
}

/**
 * Finds all reviewed businesses from the specified user and returns them in a list
 * @param {String} userId - the user specifying ID
 * @returns {Promise<Object[]>} - an Array of Businesses
 */
async function getBusinesses(userId) {
    return getReviewedBusinessIds(userId)
        .then(bidList => Promise.all(bidList.map(bid => Business.findOne({ business_id: bid }).lean())))
        // we encountered null values, thus we filter them here
        .then(busList => busList.filter(bus => null != bus))
}

/**
 * Looks at the specified users reviewed events and maps their keywords to their occurrence
 * @param {String} userID - the specified user
 * @returns {Promise<Map<String, Number>>} - a Map of <keyword, occurrence>
 */
async function featureOccurrences(userID) {
    return getBusinesses(userID).then(bList => {
        const occurrences = new Map()
        // yelps categories are a String instead of a List. 
        bList.forEach(bus => bus.categories.split(', ').reduce((occ, keyword) => {
            occ.set(keyword, (occ.get(keyword) || 0) + 1)
            return occ
        }, occurrences))
        return occurrences
    }).catch(err => console.log(err))
}

/**
 * returns the recommended business objects based on the business_ids in the recommendation list
 * @param filter
 * @returns {Promise<*>} a list of business objects
 */
async function getRecommendations(filter) {
    return ContRecomm.findOne(filter).lean().then(rec => Business.find({business_id: {$in: [...rec.business_ids]}}))
}

/**
 * returns a cursor on the business collection
 *
 * @param {FilterQuery<any>} filter
 * @returns {QueryCursor<Document<any, {}>>} cursor
 */
function businessCursor(filter) {
    return Business.find(filter).lean().cursor();
}

/**
 * get the most popular businesses based on their review-count and
 * save a reference of the object with the geocode and a online-only flag in the mostPopular collection
 *
 * @param {FilterQuery<any>} filter
 * @param {Number} entries
 * @param {{type: String, coordinates: [Number]} | undefined} geocode
 * @returns {Promise<void>} promise to check db error
 */
async function findAndSaveMostPopular(filter, entries, geocode) {
    await Business.find(filter).lean().sort({review_count: -1}).limit(entries).select("business_id -_id")
        .then(list => {
            if (geocode === "undefined") {
                MostPopular.create({online_only: true, business_ids: [...list.map(e => e.business_id)]})
            } else {
                MostPopular.create({geocode: geocode, business_ids: [...list.map(e => e.business_id)]})
            }
        })
}

/**
 * returns the most popular business objects from the business collection
 *
 * @param {FilterQuery<any>} filter
 * @returns {Promise<*>} a list of business objects
 */
async function getMostPopular(filter) {
    return MostPopular.findOne(filter).lean().then(rec => Business.find({business_id: {$in: [...rec.business_ids]}}))
}

module.exports.getReviewedBusinessIds = getReviewedBusinessIds
module.exports.featureOccurences = featureOccurrences
module.exports.getRecommendations = getRecommendations
module.exports.businessCursor = businessCursor
module.exports.getMostPopular = getMostPopular
module.exports.findAndSaveMostPopular = findAndSaveMostPopular

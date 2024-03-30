const CONFIG = require('../config/config.json')

const DEFAULT_DISTANCE = CONFIG.defaultDistance || 5000

module.exports = class Geo {

    /**
     * construct Geo object with given parameters
     * can be used to filter the geolocation or return a geoJSON
     * @param {Number | String} longitude
     * @param {Number | String} latitude
     * @param {Number | String} maxDistance
     */
    constructor(longitude, latitude, maxDistance = NaN) {
        /** {Number} */
        this.longitude = Number(longitude)
        /** {Number} */
        this.latitude = Number(latitude)
        /** {Number} */
        this.maxDistance = Number(maxDistance) || DEFAULT_DISTANCE
    }

    /**
     * returns a filter with the maxDistance given in Meters to the current coordinates
     * @returns {{$near: {$geometry: {coordinates: [number, number], type: string}, $maxDistance: number}}}
     */
    toGeoFilter() {
        return {
            $near: {
                $maxDistance: this.maxDistance, // in Meters
                $geometry: {type: 'Point', coordinates: [this.longitude, this.latitude]}
            }
        }
    }

    /**
     * returns the object as geoJSON
     * @returns {{coordinates: [number, number], type: string}}
     */
    toGeoSchema() {
        return ({
            type: 'Point',
            coordinates: [this.longitude, this.latitude]

        })
    }
}

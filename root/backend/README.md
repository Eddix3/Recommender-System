# Backend-Server

A recommender-system implemented in node.js based on the Yelp-dataset with two different approaches.
This system consists of a content-based, and a collaborative implementation fetching independent results,
and an API for interaction purposes.

## how to use 
- run `npm install`
- setup a database or connect to an existing one via `.env`
- run the script in [package.json](./package.json)

## Configuration

### Database-Connection and HTTP-Port

create a `.env` file in the [config](./config) folder to set up the following configurations:

| Key     | Description                                         |
|---------|-----------------------------------------------------| 
| PORT    | the port this server listens at - default is `3000` |
| DB_URI  | db connection string - e.g. `mongodb://<IP:Port>`   |
| DB_NAME | name of the database to connect to                  |
| DB_USER | name of the database user you want to connect as    |
| DB_PASS | password of the database user                       |

the values must be set in a `KEY=VALUE` manner e.g. `PORT=80`

for more information regarding _dotenv_ visit [here](https://github.com/motdotla/dotenv#dotenv)

### Algorithm-Configuration

you can configure either algorithm with the following constants by changing their values in this [config.json](./config/config.json):

| constant                 | type | Description                                         
|--------------------------|:----:|------------ 
| `minEntries`             | cont | Minimal amount of recommendations to be fetched. Set to `0`, if you only want to filter via `simAcceptThreshold` - integer
| `simAcceptThreshold`     | cont | Every similarity above this value gets accepted, regardless of how many we already have. Set to `1` in order to filter only via `minEntires`- numbers between `[0, 1]`
| `simDiscardThreshold`    | cont | Every similarity below this value gets discarded, regardless of how many we already have. Ensures that no misses get returned - numbers between `[0, 1]`
| `daysValid`              | cont | Sets the timespan in which recommendations are fetched and valid - integer
| `defaultDistance`        | cont | The default distance used for `geo near` Operations - in Meters (integer)                                           

where each constant with the type `cont` is used in the content based algorithm and the ones with `coll` used in the collaborative one

## API

### collaborative routes
***redacted***

### content-based routes

each route is a get-request

| `localhost:3000/recommendations/`    | description
|--------------------------------------|-------------------------------------
| ...`get/:userId/`                    | get recommendations for `user` from DB. Assumes that recommendations exist!
| ...`get/:userId/:long/:lat/:dist/`   | get recommendations for `user` from DB in geolocation. Assumes that recommendations exists!
| ...`fetch/:userId/`                  | compute recommendations for `user` and return the result
| ...`fetch/:userId/:long/:lat/:dist/` | compute recommendations for `user` in geolocation and return the result
|                                      |

batch routes, that shouldn't be accessible from outside

| `localhost:3000/batch/`              | description
|--------------------------------------|-------------------------------------
| ...`fetch/geo/`                      | compute the most popular "online" events - for convenience only 
| ...`fetch/:long/:lat/:dist/`         | compute the most popular elements for each geolocation - currenty only for one recommendation
|                                      |

## [Collaborative-Algorithm](./services/collaborative.js)
***redacted***.

## [Content-Based-Algorithm](./services/contentBased.js)
Content-Based means that we look at a users history and compare said history with an item for similarity. In order
to do this, we look at the past visited elements from a specified user and map each feature (e.g. categories) on their
occurrence. Having this map of user-features, we now can compare any given item and their categories with the user.

Imagine a `user` with the following list of categories of his past events: `[[f1, f2], [f2, f3]]` - where f is a unique feature.
Mapping this user's history results in the following vector: `vu = [f1 = 1, f2 = 2, f3 = 1]`.
Now imagine an `item` with the following categories `[f1, f2, f4]`. Having the user-vector in mind, the item-vector
looks like this: `vi = [f1 = 1, f2 = 2, f3 = 0]`. Two rather interesting things happened. First of all, `vi` has the exact
same features as `vu` even though the features weren't the same. The reason behind this is that any feature not known by the
user (such as `f4`) shouldn't influence the similarity function since we don't know whether the user likes it or not. Secondly
the values of every feature that was in both the user, and the item has the same value - and every feature not present in
the item is set to 0. This is to take the weight of a feature into consideration.

The final comparison is done via [Cosine-Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)

## [Yelp-Dataset](https://www.yelp.com/dataset)
We used the Yelp-Dataset since there are many parallels between yelp and ***redacted***. Users and Items have many important 
attributes in common such as `categories` or `geolocation`.

In order to use the geolocation in the Yelp-Dataset and to also have the same geolocation pattern as ***redacted***, we added 
a `geolocation`-field as it is common im mongoDB. This enables the possibility to work with a geolocation index and with
geonear functions.

## models
We added the following collections to the database:

| Collection  | Usage
|-------------|-------------------------
| collRecomm  | saves a list of item-ids based on collaborative recommendations
| contRecomm  | saves a list of item-ids per user (per geolocation) per time-frame
| mostPopular | saves a list of item-ids per geolocation
| userData    | saves user ratings mapped to each user

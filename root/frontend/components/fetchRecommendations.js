import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { useSelector, useDispatch} from 'react-redux'
import {loadingFailed,loadingSuccess,loadingNow} from "./storeData";
import DistanceModal from "./distanceModal";
import CONFIG from '../config/config.json'

const host = CONFIG.host

/**
 * A List for the recommendations
 * @returns {JSX.Element}
 * @constructor
 */
function Liste() {
    const {data, loading, error, userId} = useSelector(state => state.data)
    const dispatch = useDispatch()

    /**
     * Fetches the recommendation from the uri
     * @param uri
     * @returns {Promise<void>}
     */
    const fetchData = async (uri) => {
        dispatch(loadingNow())
        try {
            console.log(userId)
            console.log(uri)
            const response = await fetch(uri);
            const json = await response.json();
            console.log(json)
            await dispatch(loadingSuccess(json)) // nur json für api
        }
        catch (e) {
            dispatch(loadingFailed())
        }
    };

    /**
     * Passing the uri to get the recommendations from the Colleberative Filtering
     */
    const getRecommendationsCBF = () => {
        const uri = `${host}/recommendations/getCF/${userId}`
        fetchData(uri).then(() => {})
    }
    /**
     * Passing the uri to get the recommendations from the Content-Based Filtering
     */
    const getRecommendationsCB = () => {
        // userid und position
        const uri = `${host}/recommendations/get/${userId}`
        fetchData(uri).then(() => {})
    }

        if(loading)  {
            return(
                <View style={styles.container}>
                    <Text>
                        Loading Data...
                    </Text>
                </View>
            );
        }
        if(data.length == 0 && !error) {
            return (
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={getRecommendationsCB}
                    >
                        <Text>Content-Based Filtering</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={getRecommendationsCBF}
                    >
                        <Text>Collaborative Filtering</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if(error) {
            return (
                <View style={styles.container}>
                    <Text>Laden der Vorschläge fehlgeschlagen</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={getRecommendationsCB}
                    >
                        <Text>Content-Based Filtering</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={getRecommendationsCBF}
                    >
                        <Text>Collaborative Filtering</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return(
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={getRecommendationsCB}
                >
                    <Text>Content-Based Filtering</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={getRecommendationsCBF}
                >
                    <Text>Collaborative Filtering</Text>
                </TouchableOpacity>
                    <FlatList
                        data={data}
                        style={styles.list}
                        keyExtractor={(x, i) => i.toString()}
                        renderItem={({item }) =>
                            <Text style={styles.row}>
                                {`${item.name}\n
                                ${item.address}\n
                                ${item.postal_code} ${item.city}
                                `}
                            </Text>}
                    />
                <DistanceModal/>
                </View>

            );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        margin: 10
    },
    row: {
        padding: 15,
        marginBottom: 5,
        backgroundColor: 'black',
        color:'white',
        textAlign: 'right',
    },
});

export default Liste;

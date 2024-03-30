import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useSelector, useDispatch} from 'react-redux'
import MapView from 'react-native-maps';
import {setTempPosition, setModalVisible, setDistanceModal} from "./storeData";
import LoadedMap from './mapWithMarkers'
import MapModal from './mapModal'
import DistanceModal from "./distanceModal";

/**
 * Map component with the option to get recommendations from current location touched or the already loaded recommendations
 * @returns {JSX.Element}
 * @constructor
 */
function Map() {
    const {data} = useSelector(state => state.data)
    const dispatch = useDispatch()
    const handlePress = (e) => {
        console.log(e.nativeEvent.coordinate)
        dispatch(setTempPosition(e.nativeEvent.coordinate))
        dispatch(setDistanceModal(true))
        //dispatch(setModalVisible(true))
    }

    if (data.length == 0) {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    onPress={(region) => handlePress(region)}
                    initialRegion={{
                        latitude: 40,
                        longitude: -100,
                        latitudeDelta: 25,
                        longitudeDelta: 25,
                    }}
                >
                </MapView>
                <DistanceModal/>
                <MapModal/>
            </View>
        )
    }
    else {
        return (
            <LoadedMap/>
        )
    }
};


export default Map;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

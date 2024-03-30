import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useSelector} from 'react-redux'
import MapView, {Marker} from 'react-native-maps';

/**
 * Map component showing the loaded recommendations
 * @returns {JSX.Element}
 * @constructor
 */
function Map() {
    const {data, position} = useSelector(state => state.data)
    const mapRef = React.useRef(null)
    const fitMarkers = () => {
        let markers = [];
        data.map((marker) => markers.push({
            latitude: marker.geocode.coordinates[1],
            longitude: marker.geocode.coordinates[0]
        }));
        if(position) markers.push(position)
        mapRef.current.fitToCoordinates(markers, {
            edgePadding: {
                top: 150,
                right: 50,
                bottom: 50,
                left: 50
            }
        });
    }
    const PlacePosition = () => {
        if (!position) return null
        return(
            <Marker
                coordinate={position}
                pinColor={'green'}
                title={'Deine Position'}
            />
            )
    }

    return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    showsPointsOfInterest={true}
                    ref={mapRef}
                    onLayout={() => fitMarkers()}
                >
                    <PlacePosition/>
                    {data.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: marker.geocode.coordinates[1],
                                longitude: marker.geocode.coordinates[0]
                            }}
                            pinColor={'#000000'}
                            title={marker.name}
                            description={marker.address}
                        />
                    ))}
                </MapView>
            </View>
        )

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

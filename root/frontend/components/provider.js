import React from 'react'
import {
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text
} from 'react-native'
import FetchRecommendations from './fetchRecommendations'
import Map from './map'
import { TabView, SceneMap } from 'react-native-tab-view';
import { useSelector, useDispatch} from 'react-redux'
import {setUser, logout, setPosition, setDistanceModal} from "./storeData";

const initialLayout = { width: Dimensions.get('window').width };

const renderScene = ({ route }) => {
    switch (route.key) {
        case 'first':
            return <FetchRecommendations />;
        case 'second':
            return <Map />;
        default:
            return null;
    }
};

/**
 * Component that wraps all other components used for the 'Entdecken' Screen
 * @param route
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
export default function Provider({route, navigation}){
    const {user} = route.params
    const dispatch = useDispatch()
    const {distanceModal} = useSelector(state => state.data)
    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'first', title: 'Liste' },
        { key: 'second', title: 'Karte' },
    ]);
    React.useEffect(
        () => {
            dispatch(setUser(user.userId))
            dispatch(setPosition(user.geocode))
        }, []
    );
    React.useEffect(
        () =>
            navigation.addListener('beforeRemove', () => {
                dispatch(logout())
                }),
        [navigation]
    );

    return (
        <TabView
            navigationState={{ index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            indicatorStyle={{ backgroundColor: 'black' }}
            style={styles.container}
        >
        </TabView>

    );
}

const styles = StyleSheet.create({
    container: {
    },
    scene: {
        flex: 1,
    },
    distanceHeader: {
        backgroundColor: "#2196F3",
        padding: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    headerText: {
        textAlign: "center",
        fontSize: 15
    },
});

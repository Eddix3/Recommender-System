import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Entdecken from './provider'

/**
 * The starting screen, where you can choose a test user
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
function HomeScreen({ navigation }) {
    const users = [
        {
            userId:'---2PmXbF47D870stH1jqA',
            geocode:{
                "latitude": 34.12139475079355,
                "longitude": -84.56915404647589,
            }
        },
        {
            userId: 'j5yfS1QjGwNLQ0h4_wDyxg',
            geocode: {
                "latitude": 45.08976414534354,
                "longitude": -116.43419545143843,
            }
        },
        {
            userId:'n36fNEKeWMLoFtgV7omwZw',
            geocode:{
                "latitude": 39.62425842647607,
                "longitude": -79.56069029867649,
            }
    }];
    return (
        <View style={{ flex: 1, alignItems: 'center'}}>
            <Text
            style={{margin: 20, fontSize: 20}}>Choose User to continue</Text>
            {users.map((user, index) => (
                <TouchableOpacity
                    key={index}
                    style={{width: '100%'}}
                    onPress={() => {
                        /* 1. Navigate to the Details route with params */
                        navigation.navigate('Entdecken', {
                            user
                        });
                    }}
                >
                    <Text
                        style={styles.row}
                    >
                        User:   {user.userId}{'\n'}
                        Geocode: {user.geocode.longitude}, {user.geocode.latitude}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const Stack = createStackNavigator();

export default function chooseUser() {

    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Entdecken" component={Entdecken} />
            </Stack.Navigator>
        </NavigationContainer>
    )

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
        textAlign: 'left',
    },
});

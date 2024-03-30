import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Modal} from "react-native";
import { useSelector, useDispatch} from 'react-redux'
import {setModalVisible, setPosition, loadingNow, loadingFailed, loadingSuccess, setError} from "./storeData";
import CONFIG from '../config/config.json'

const host = CONFIG.host
/**
 * Component to confirm the search for recommendations with the last touched location on the map
 * @returns {JSX.Element}
 * @constructor
 */
function MapModal() {
    const {modalVisible, loading, tempPosition, userId, error, distance, data} = useSelector(state => state.data)
    const dispatch = useDispatch()

    /**
     * Search for recommendations in new area and save the result in the store
     * @returns {Promise<void>}
     */
    const search = async () => {
        dispatch(loadingNow())
        try {
            console.log(tempPosition)
            const uri = `${host}/recommendations/fetch/${userId}/${tempPosition.longitude}/${tempPosition.latitude}/${(distance * 1000)}`
            console.log(uri)
            const response = await fetch(uri);
            const json = await response.json();
            console.log(json)
            if(json.length == 0) dispatch(loadingFailed())
            else {
                dispatch(loadingSuccess(json)) // nur json für api
                dispatch(setPosition(tempPosition))
                dispatch(setModalVisible(!modalVisible))
            }
        }
        catch (e) {
            dispatch(loadingFailed())
        }
    }
    if(loading) {
        return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Loading...</Text>
                        </View>
                    </View>
                </Modal>

        )
    }
    if(error) {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    dispatch(setModalVisible(!modalVisible));
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>keine Ergebnisse gefunden</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                dispatch(setModalVisible(!modalVisible))
                                dispatch(setError(false))
                            }}
                        >
                            <Text style={styles.textStyle}>Zurück</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
    return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    dispatch(setModalVisible(!modalVisible));
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Empfehlungen in der Umgebung finden ?</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => search()}
                        >
                            <Text style={styles.textStyle}>Bestätigen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => dispatch(setModalVisible(!modalVisible))}
                        >
                            <Text style={styles.textStyle}>Zurück</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
    )
}

export default MapModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        margin: 10
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

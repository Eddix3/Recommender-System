import React from 'react'
import {
    StyleSheet,
    TouchableOpacity, Modal, View, Text
} from 'react-native'
import { useSelector, useDispatch} from 'react-redux'
import { setDistance, setDistanceModal, setModalVisible} from "./storeData";

/**
 * Component for selecting the distance
 * @returns {JSX.Element}
 * @constructor
 */
function DistanceModal () {
    const distParams = [1, 5, 10, 25, 50, 100]
    const dispatch = useDispatch()
    const {distance, distanceModal} = useSelector(state => state.data)

    return(
    <Modal
        animationType="slide"
        transparent={true}
        visible={distanceModal}
        onRequestClose={() => {
            dispatch(setDistanceModal(!distanceModal))
        }}
    >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Umkreis deiner Suche</Text>
                {distParams.map((dist, index) =>
                    (
                        <TouchableOpacity
                            key={index}
                            style={[styles.button]}
                            onPress={() => {
                                dispatch(setDistance(dist))
                                dispatch(setDistanceModal(!distanceModal))
                                dispatch(setModalVisible(true))
                            }}
                        >
                            <Text style={[styles.textStyle, distance === dist ? styles.blueText: styles.blackText]}>{dist} Kilometer</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
        </View>
    </Modal>
    )
}

export default DistanceModal;
const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        margin: 10,
        width: '50%',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22,
    },
    modalView: {
        margin: '10%',
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
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20
    },
    blueText: {
        color: "blue",
    },
    blackText: {
        color: "black",
    },
});

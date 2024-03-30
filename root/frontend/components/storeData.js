import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId: '',
    loading:false,
    error: false,
    data: [],
    position: null,
    modalVisible: false,
    tempPosition: null,
    distance: 5,
    distanceModal: false
}

/**
 * Our initial state and reducers for our application
 * @type {Slice<{modalVisible: boolean, tempPosition: null, data: [], distance: number, distanceModal: boolean, position: null, loading: boolean, error: boolean, userId: string}, {setDistanceModal: reducers.setDistanceModal, logout: (function(*): {modalVisible: boolean, tempPosition: null, data: [], distance: number, distanceModal: boolean, position: null, loading: boolean, error: boolean, userId: string}), loadingSuccess: reducers.loadingSuccess, setDistance: reducers.setDistance, setError: reducers.setError, setModalVisible: reducers.setModalVisible, setTempPosition: reducers.setTempPosition, loadingNow: reducers.loadingNow, loadingFailed: reducers.loadingFailed, setUser: reducers.setUser, setPosition: reducers.setPosition}, string>}
 */
export const dataStore = createSlice({
    name: 'data',
    initialState,
    reducers: {
        loadingSuccess: (state, action) => {
            state.data = action.payload
            state.loading = false
            state.error = false
        },
        loadingNow: state => {
            state.loading = true
        },
        loadingFailed: state => {
            state.loading = false
            state.error = true
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setPosition: (state, action) => {
           state.position = action.payload
        },
        setTempPosition: (state, action) => {
            state.tempPosition = action.payload
        },
        setUser: (state, action) => {
            state.userId = action.payload
        },
        logout: state => {
            return initialState;
        },
        setModalVisible: (state, action) => {
            state.modalVisible = action.payload
        },
        setDistanceModal: (state, action) => {
            state.distanceModal = action.payload
        },
        setDistance: (state, action) => {
            state.distance = action.payload
        }
    }
})

export const {loadingSuccess,loadingNow, loadingFailed, setError, setPosition,
    setTempPosition, setUser, logout, setModalVisible, setDistanceModal, setDistance } = dataStore.actions

export default dataStore.reducer

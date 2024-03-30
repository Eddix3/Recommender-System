import { configureStore } from '@reduxjs/toolkit'
import storeData from "./storeData";
import { getDefaultMiddleware } from '@reduxjs/toolkit'

/**
 * Our store for saving different states during the runtime of our application
 */
export default configureStore({
    reducer: {
        data: storeData,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

import React from 'react'
import store from './components/store'
import { Provider } from 'react-redux'
import ChooseUser from './components/chooseUser'

/**
 * Our main component provided with the redux store
 * @returns {JSX.Element}
 * @constructor
 */
export default function App() {
    return (
        <Provider store={store}>
            <ChooseUser />
        </Provider>
    );
}


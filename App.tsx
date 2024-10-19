import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './src/Redux/Store'
import AppNavigation from './src/navigators/AppNavigation'
import MapScreen from './src/Screens/Main/Stacks/MapScreen'
import TestScreen from './src/Screens/Main/Stacks/TestScreen'
import ZaloPay from './src/utils/ZaloPay'


const App = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <StatusBar barStyle="dark-content" backgroundColor='transparent' translucent />
          <AppNavigation />
          {/* <MapScreen /> */}
          {/* <ZaloPay /> */}
          {/* <TestScreen /> */}
        </PersistGate>
      </Provider>

    </>

  )
}

export default App

const styles = StyleSheet.create({})
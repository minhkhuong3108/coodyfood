import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SplashScreen from './src/Screens/SplashScreen'
import OnboardingScreen from './src/Screens/Auth/OnboardingScreen'
import LoginScreen from './src/Screens/Auth/LoginScreen'
import RegisterScreen from './src/Screens/Auth/RegisterScreen'
import VerifyScreen from './src/Screens/Auth/VerifyScreen'
import ForgotPassword from './src/Screens/Auth/ForgotPassword'
import { NavigationContainer } from '@react-navigation/native'
import AuthNavigation from './src/navigators/AuthNavigation'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './src/Redux/Store'

const App = () => {
  return (
    <>

      <Provider store={store}>
        <PersistGate persistor={persistor}>
        <StatusBar barStyle="dark-content" backgroundColor='transparent' translucent />
        <NavigationContainer>
          <AuthNavigation />
        </NavigationContainer>
        </PersistGate>
      </Provider>

    </>

  )
}

export default App

const styles = StyleSheet.create({})
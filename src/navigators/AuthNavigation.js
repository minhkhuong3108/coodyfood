import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import OnboardingScreen from '../Screens/Auth/OnboardingScreen'
import LoginScreen from '../Screens/Auth/LoginScreen'
import RegisterScreen from '../Screens/Auth/RegisterScreen'
import ForgotPassword from '../Screens/Auth/ForgotPassword'
import VerifyScreen from '../Screens/Auth/VerifyScreen'
import { NavigationContainer } from '@react-navigation/native'
const Stack = createStackNavigator()

const AuthNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='Onboarding' component={OnboardingScreen} />
            <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
            <Stack.Screen name='Verify' component={VerifyScreen} />
        </Stack.Navigator>

    )
}

export default AuthNavigation

const styles = StyleSheet.create({})
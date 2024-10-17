import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import SplashScreen from '../Screens/SplashScreen'
import MainNavigation from './MainNavigation'
import AuthNavigation from './AuthNavigation'

const AppNavigation = () => {
    const { user } = useSelector(state => state.login)
    const [isShowSplash, setIsShowSplash] = useState(true)

    const linking = {
        prefixes: ['coodyfood://'],
        config: {
            screens: {
                SuccessPayment: 'success-payment',
                FailPayment: 'fail-payment',
            },
        },
    }

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setIsShowSplash(false)
        }, 2000)
        return () => clearTimeout(timeOut)
    }, [])
    return (
        <NavigationContainer linking={linking}>
            {isShowSplash ? <SplashScreen /> : user ? <MainNavigation /> : <AuthNavigation />}
        </NavigationContainer>
    )
}

export default AppNavigation

const styles = StyleSheet.create({})
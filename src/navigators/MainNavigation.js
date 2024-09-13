import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../Screens/Main/Tabs/HomeScreen'
import SearchScreen from '../Screens/Main/Stacks/SearchScreen'
import ShopDetailScreen from '../Screens/Main/Stacks/ShopDetailScreen'
import ProductDetail from '../Screens/Main/Stacks/ProductDetail'

const Stack = createStackNavigator()

const MainNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='ProductDetail' component={ProductDetail} />
            <Stack.Screen name='Shop' component={ShopDetailScreen} />
            <Stack.Screen name='Search' component={SearchScreen} />
            <Stack.Screen name='Home' component={HomeScreen} />
        </Stack.Navigator>
    )
}

export default MainNavigation

const styles = StyleSheet.create({})
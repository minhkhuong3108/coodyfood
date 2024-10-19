import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../Screens/Main/Tabs/HomeScreen'
import SearchScreen from '../Screens/Main/Stacks/SearchScreen'
import ShopDetailScreen from '../Screens/Main/Stacks/ShopDetailScreen'
import ProductDetail from '../Screens/Main/Stacks/ProductDetail'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TextComponent from '../components/TextComponent'
import { appColor } from '../constants/appColor'
import EditProfile from '../Screens/Profile/EditProfile'
import ReviewShopScreen from '../Screens/Main/Stacks/ReviewShopScreen'
import TicketSaleScreen from '../Screens/Main/Stacks/TicketSaleScreen'
import ProductFavoriteScreen from '../Screens/Main/Stacks/ProductFavoriteScreen'
import ProfileScreen from '../Screens/Main/Stacks/ProfileScreen'
import CheckOutScreen from '../Screens/Main/Stacks/CheckOutScreen'
import CheckOrderScreen from '../Screens/Main/Stacks/CheckOrderScreen'
import AddressScreen from '../Screens/Main/Stacks/AddressScreen'
import EditAddressScreen from '../Screens/Main/Stacks/EditAddressScreen'
import AddAddressScreen from '../Screens/Main/Stacks/AddAddressScreen'
import MyOrderScreen from '../Screens/MyOrder/MyOrderScreen'
import DetailOrderScreen from '../Screens/MyOrder/DetailOrderScreen'
import SearchAddressScreen from '../Screens/Main/Stacks/SearchAddressScreen'
import TestScreen from '../Screens/Main/Stacks/TestScreen'
import PayOSPaymentScreen from '../Screens/Main/Stacks/PayOSPaymentScreen'
import SuccessPaymentScreen from '../Screens/Main/Stacks/SuccessPaymentScreen'
import FailedPaymentScreen from '../Screens/Main/Stacks/FailedPaymentScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const MainNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Tab' component={TabNavigation} />
            <Stack.Screen name='Product' component={ProductDetail} />
            <Stack.Screen name='Shop' component={ShopDetailScreen} />
            <Stack.Screen name='Search' component={SearchScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Myorder" component={MyOrderScreen} />
            <Stack.Screen name="DetailOrder" component={DetailOrderScreen} />
            <Stack.Screen name="ReviewShop" component={ReviewShopScreen} />
            <Stack.Screen name="TicketSale" component={TicketSaleScreen} />
            <Stack.Screen name="ProductFavorite" component={ProductFavoriteScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="CheckOut" component={CheckOutScreen} />
            <Stack.Screen name="CheckOrder" component={CheckOrderScreen} />
            <Stack.Screen name="Address" component={AddressScreen} />
            <Stack.Screen name="EditAddress" component={EditAddressScreen} />
            <Stack.Screen name="AddAddress" component={AddAddressScreen} />
            <Stack.Screen name="SearchAddress" component={SearchAddressScreen} />
            <Stack.Screen name="PayOS" component={PayOSPaymentScreen} />
            <Stack.Screen name="SuccessPayment" component={SuccessPaymentScreen} />
            <Stack.Screen name="FailPayment" component={FailedPaymentScreen} />
        </Stack.Navigator>
    )
}

const TabNavigation = () => {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false, tabBarShowLabel: false,
            tabBarStyle: styles.tabBar, tabBarHideOnKeyboard: true
        }}
            initialRouteName='Home' >
            <Tab.Screen name='Home' component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.viewTabItem}>
                            {focused ?
                                <Image source={require('../assets/images/tabBar/homed.png')}
                                    style={styles.imgTab}
                                    resizeMode='contain'
                                /> :
                                <Image source={require('../assets/images/tabBar/home.png')}
                                    style={styles.imgTab}
                                    resizeMode='contain'
                                    tintColor={appColor.text}
                                />
                            }
                            <TextComponent text={'Trang chủ'} fontsize={10} color={focused ? appColor.primary : appColor.text} styles={{ marginTop: 5 }} />
                        </View>
                    )
                }}
            />
            <Tab.Screen name='Cart' component={MyOrderScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.viewTabItem}>
                            {focused ?
                                <Image source={require('../assets/images/tabBar/carted.png')}
                                    style={styles.imgTab}
                                    resizeMode='contain'
                                /> :
                                <Image source={require('../assets/images/tabBar/cart.png')}
                                    style={styles.imgTab}
                                    resizeMode='contain'
                                    tintColor={appColor.text}
                                />
                            }
                            <TextComponent text={'Đơn hàng'} fontsize={10} color={focused ? appColor.primary : appColor.text} styles={{ marginTop: 5 }} />
                        </View>
                    )
                }}
            />
            {/* <Tab.Screen name='Favorite' component={ShopDetailScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.containerFavor}>
                            <View style={[styles.viewFavor, styles.shadow]}>
                                <Image source={require('../assets/images/tabBar/favor.png')}
                                    resizeMode='contain'
                                    tintColor={appColor.white}
                                    style={styles.imgFavor}
                                />
                            </View>
                        </View>
                    )
                }}
            /> */}
            <Tab.Screen name='Favorite' component={AddressScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.viewTabItem}>
                            {focused ?
                                <Image source={require('../assets/images/tabBar/hearted.png')}
                                    style={styles.imgTab}
                                    resizeMode='contain'
                                /> :
                                <Image source={require('../assets/images/tabBar/heart.png')}
                                    style={styles.imgTab}
                                    resizeMode='contain'
                                // tintColor={appColor.text}
                                />
                            }
                            <TextComponent text={'Yêu thích'} fontsize={10} color={focused ? appColor.primary : appColor.text} styles={{ marginTop: 5 }} />
                        </View>
                    )
                }}
            />
            <Tab.Screen name='Profile' component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.viewTabItem}>
                            {focused ?
                                <Image source={require('../assets/images/tabBar/profiled.png')}
                                    style={styles.imgTab}
                                    resizeMode='contain'
                                /> :
                                <Image source={require('../assets/images/tabBar/profile.png')}
                                    style={styles.imgTab}
                                    resizeMode='contain'
                                    tintColor={focused ? appColor.primary : appColor.text}
                                />
                            }
                            <TextComponent text={'Tài khoản'} fontsize={10} color={focused ? appColor.primary : appColor.text} styles={{ marginTop: 5 }} />
                        </View>
                    )
                }}
            />

        </Tab.Navigator>
    )
}

export default MainNavigation

const styles = StyleSheet.create({
    containerFavor: {
        position: 'absolute',
        top: -20,
        padding: 4,
        backgroundColor: appColor.white,
        borderRadius: 70 / 2,
        borderColor: appColor.primary,
        borderWidth: 2,
    },
    imgFavor: {
        width: 25,
        height: 25
    },
    shadow: {
        shadowColor: 'rgba(0, 0, 0, 0.9)',
        elevation: 5
    },
    viewFavor: {
        // position: 'absolute',
        // top: -25,
        width: 55,
        height: 55,
        // padding: 5,
        backgroundColor: appColor.primary,
        borderBlockColor: appColor.text,
        borderRadius: 60 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabBar: {
        height: 60,
        backgroundColor: appColor.white,
    },
    imgTab: {
        width: 25,
        height: 25
    },
    viewTabItem: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})
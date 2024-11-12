import { Button, PermissionsAndroid, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapboxGL from '@rnmapbox/maps'
import MapAPI from '../../../core/apiMap/MapAPI'
import SpaceComponent from '../../../components/SpaceComponent'
import { SERVER } from '../../../core/apiMap/contains'
import Geolocation from 'react-native-geolocation-service'
import axios from 'axios'
import { Car, Shop } from 'iconsax-react-native'
import { appColor } from '../../../constants/appColor'
const polyline = require('@mapbox/polyline')

MapboxGL.setAccessToken('pk.eyJ1IjoibWFzdGVydGFvMzIxIiwiYSI6ImNtMWtrMzFhMTB6bW0ya29jMjZnbXJscnEifQ.c39zAYV1D82VHxuCJNe9Jw')

const MapScreen = () => {
    const [locations, setLocations] = useState([]);
    const [search, setSearch] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [route, setRoute] = useState(null);
    const [routeToCustomer, setRouteToCustomer] = useState(null);
    const [routeToShop, setRouteToShop] = useState(null);
    const [shopLocation, setShopLocation] = useState([106.641335, 10.867153]);
    const [customerLocation, setCustomerLocation] = useState([106.700424, 10.775659]);
    const [atRestaurant, setAtRestaurant] = useState(false);   
    const [locationUser, setLocationUser] = useState(null);
    console.log('route', route);

    console.log('userLocation', userLocation);

    const camera = useRef(null);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;

        }
        return true;
    };

    const getUserLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([longitude, latitude]);
            },
            (error) => {
                console.error(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const getDirections = async () => {
        const decodePolyline = encoded => {
            const decoded = polyline.decode(encoded);

            return decoded.map(point => ({
                latitude: point[0],
                longitude: point[1],
            }));
        };
        try {
            if (!atRestaurant) {
                // Lấy chỉ đường từ vị trí shipper đến nhà hàng
                const directionToRestaurant = await MapAPI.getDirections({
                    vehicle: 'bike',
                    origin: userLocation,
                    destination: shopLocation,
                });

                if (directionToRestaurant.routes && directionToRestaurant.routes.length > 0) {
                    const route = decodePolyline(directionToRestaurant.routes[0].overview_polyline.points);
                    setRouteToShop(route);
                }
            } else {
                // Lấy chỉ đường từ nhà hàng đến chỗ người đặt hàng
                const directionToCustomer = await MapAPI.getDirections({
                    vehicle: 'bike',
                    origin: shopLocation,
                    destination: customerLocation,
                });

                if (directionToCustomer.routes && directionToCustomer.routes.length > 0) {
                    const route = decodePolyline(directionToCustomer.routes[0].overview_polyline.points);
                    setRouteToCustomer(route);
                }
            }
        } catch (error) {
            console.log('error', error);
        }
    }


    useEffect(() => {
        requestLocationPermission().then((hasPermission) => {
            if (hasPermission) {
                getUserLocation();
            }
        });
    }, []);

    const handleGetDirections = () => {
        if (userLocation && customerLocation && shopLocation) {
            getDirections();
        }
    };

    const handleArriveAtRestaurant = () => {
        setAtRestaurant(true);
    };

    useEffect(() => {
        if (atRestaurant) {
            getDirections(); // Lấy chỉ đường từ nhà hàng đến chỗ người đặt hàng khi atRestaurant thay đổi
        }
    }, [atRestaurant]);

    return (
        <View style={styles.container}>
            <SpaceComponent height={70} />
            <TextInput
                style={styles.input}
                placeholder="Enter destination coordinates"
            // value={search}
            // onChangeText={updateSearch}
            />
            <Button title="Get Directions" onPress={handleGetDirections} />
            <SpaceComponent height={20} />
            <Button title="Arrive at restaurant" onPress={handleArriveAtRestaurant} />
            <MapboxGL.MapView style={styles.map}>
                {userLocation && (
                    <MapboxGL.PointAnnotation
                        id="userLocation"
                        coordinate={userLocation}
                    />
                )}
                {shopLocation && (
                    <MapboxGL.PointAnnotation
                        id="restaurantLocation"
                        coordinate={shopLocation}
                    >
                        <Shop color={appColor.primary} size={30} />
                    </MapboxGL.PointAnnotation>
                )}
                {customerLocation && (
                    <MapboxGL.PointAnnotation
                        id="customerLocation"
                        coordinate={customerLocation}
                    >
                        <Car color={appColor.primary} size={30} />
                    </MapboxGL.PointAnnotation>
                )}
                {routeToShop && !atRestaurant && (
                    <MapboxGL.ShapeSource id="routeToRestaurantSource" shape={{
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: routeToShop.map(coord => [
                                coord.longitude,
                                coord.latitude,
                            ]),
                        },
                    }}>
                        <MapboxGL.LineLayer id="routeToRestaurantFill"
                            style={{ lineColor: appColor.primary, lineWidth: 3, lineCap: 'round', lineJoin: 'round' }} />
                    </MapboxGL.ShapeSource>
                )}
                {routeToCustomer && atRestaurant && (
                    <MapboxGL.ShapeSource id="routeToCustomerSource" shape={{
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: routeToCustomer.map(coord => [
                                coord.longitude,
                                coord.latitude,
                            ]),
                        },
                    }}>
                        <MapboxGL.LineLayer id="routeToCustomerFill"
                            style={{ lineColor: appColor.primary, lineWidth: 3, lineCap: 'round', lineJoin: 'round' }} />
                    </MapboxGL.ShapeSource>
                )}
                {userLocation && (
                    <MapboxGL.Camera
                        ref={camera}
                        zoomLevel={15} // Mức thu phóng của bản đồ
                        centerCoordinate={userLocation}
                        animationMode='flyTo' // Chế độ di chuyển của camera
                        animationDuration={3000}
                        pitch={20}
                    />
                )}
            </MapboxGL.MapView>
        </View>
    );
};

export default MapScreen;


const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
})
import { StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import MapboxGL from '@rnmapbox/maps'
import MapAPI from '../../../core/apiMap/MapAPI'

MapboxGL.setAccessToken('pk.eyJ1IjoibWFzdGVydGFvMzIxIiwiYSI6ImNtMWtrMzFhMTB6bW0ya29jMjZnbXJscnEifQ.c39zAYV1D82VHxuCJNe9Jw')

const MapScreen = () => {

    const [loadMap] = useState();
    /*sử dụng Load Map*/ // kiểu URL cho bản đồ
    const [coordinates] = useState([105.83991, 21.028]); // Vị trí mà bản đồ nên căn giữa. [lng, lat]


    const camera = useRef(null);
    const [locations, setLocations] = useState([]);
    // sử dụng goong Api để lấy setlocation
    const getPlacesAutocomplete = async () => {
        let autoComplete = await MapAPI.getPlacesAutocomplete({
            search: encodeURIComponent(search),
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <MapboxGL.MapView
                styleURL={loadMap}
                // onPress={handleOnPress}
                style={{ flex: 1 }}
                projection="globe" //Phép chiếu được sử dụng khi hiển thị bản đồ
                zoomEnabled={true}
            >
                <MapboxGL.PointAnnotation
                    id={``}
                    key={`}`}
                    coordinate={coordinates} // điểm hiển thị
                    draggable={true} >
                </MapboxGL.PointAnnotation>
                <MapboxGL.Camera
                    ref={camera}
                    zoomLevel={15} // Mức thu phóng của bản đồ
                    centerCoordinate={coordinates}
                    animationMode='flyTo' // Chế độ di chuyển của camera
                    animationDuration={3000}
                    pitch={20}
                />

            </MapboxGL.MapView>
        </View >
    )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
})
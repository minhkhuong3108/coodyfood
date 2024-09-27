import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Camera,
  getCameraDevice,
  getCameraFormat,
  useCameraDevices,
} from 'react-native-vision-camera';
import {appColor} from '../../constants/appColor';
const CameraComponent = ({setShowcamera, setImageSource}) => {
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = getCameraDevice(devices, 'back');
  const format = getCameraFormat(device, [{fps: 120}]);
  const fps = format.maxFps;
  const [cameraPermission, setCameraPermission] = useState(false);

  useEffect(() => {
    getPermission = async () => {
      const newCameraPermission = await Camera.requestCameraPermission();
      setCameraPermission(newCameraPermission == 'granted');
    };
    getPermission();
  }, []);

  const capturePhoto = async () => {
    if (camera.current != null) {
      const photo = await camera.current.takePhoto();
      setImageSource(photo.path);
      setShowcamera(false);
      console.log(photo.path);
    }
  };
  return (
    <View style={styles.container}>
      {cameraPermission && (
        <View style={styles.container2}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo
            photoQualityBalance="speed"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              capturePhoto();
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShowcamera(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default CameraComponent;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  container2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    margin: '10%',
    width: '20%',
    aspectRatio: 1,
    borderWidth: 5,
    borderColor: appColor.white,
    borderRadius: 99,
  },
});

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Camera,
  getCameraDevice,
  getCameraFormat,
  useCameraDevices,
} from 'react-native-vision-camera';
import {appColor} from '../../../constants/appColor';
const CameraComponent = ({setShowcamera, setImageSource}) => {
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = getCameraDevice(devices, 'back');
  const format = getCameraFormat(device, [{fps: 120}]); ////fps
  const fps = format.maxFps; //fps tối đa của thiết bị nhưng chưa dùng
  const [cameraPermission, setCameraPermission] = useState(false);

  //kiểm tra quyền camera
  useEffect(() => {
    getPermission = async () => {
      const newCameraPermission = await Camera.requestCameraPermission();
      setCameraPermission(newCameraPermission == 'granted');
    };
    getPermission();
  }, []);

  //nhận ảnh sau khi chụp
  const capturePhoto = async () => {
    if (camera.current != null) {
      const photo = await camera.current.takePhoto();
      setImageSource(photo.path);
      setShowcamera(false);
      console.log(photo.path);
    }
  };
  //thoát camera khi người dùng nhấn nút back
  useEffect(() => {
    const backAction = () => {
      setShowcamera(false); // Đóng camera
      return true; // Chặn hành động mặc định của nút back
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove(); // Loại bỏ listener khi component unmount
  }, []);
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
          <View style={styles.bottom}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                capturePhoto();
              }}
            />
            <TouchableOpacity
              style={styles.cancel}
              onPress={() => {
                setShowcamera(false);
              }}>
              <Image
                style={styles.img}
                source={require('../../../assets/images/shipper/canelcamera.png')}
              />
            </TouchableOpacity>
          </View>
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
  cancel: {
    width: '16%',
    aspectRatio: 1,
    position: 'absolute',
    left: 15,
  },
  bottom: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: appColor.white,
  },
});

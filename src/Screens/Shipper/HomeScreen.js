import {View, Text, Image, StyleSheet, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import ModalviewComponent from './ComposenentShipper/ModalviewComponent';
import OrderDetailsComponent from './ComposenentShipper/OrderDetailsComponent';

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [order, setOrder] = useState(false);
  //giả lập sau 2s sẽ có đơn
  useEffect(() => {
    setTimeout(() => {
      setModalVisible(true);
    }, 2000);
  }, []);
  return (
    <View style={{flex: 1}}>
      {modalVisible && (
        <ModalviewComponent
          setModalVisible={setModalVisible}
          setOrder={setOrder}
        />
      )}
      {order && <OrderDetailsComponent />}
      <Image
        style={styles.img}
        source={require('../../assets/images/shipper/map.png')}
      />
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  img: {
    position: 'absolute',
    zIndex: 0,
    flex: 1,
  },
});

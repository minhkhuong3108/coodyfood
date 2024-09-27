import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';


const CheckComponent = ({checked, height, start}) => {
  return (
    <View style={[styles.boxed, {top: height}]}>
      {start && (
        <Image
          style={[styles.imgcheck]}
          source={
            checked
              ? require('../../../assets/images/shipper/checked.png')
              : require('../../../assets/images/shipper/noncheck.png')
          }
        />
      )}
    </View>
  );
};

export default CheckComponent;
const styles = StyleSheet.create({
  imgcheck: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  boxed: {
    flex: 1,
    width: '7.7%',
  },
});

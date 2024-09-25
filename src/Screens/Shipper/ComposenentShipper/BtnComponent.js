import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

import TextComponent from '../../../components/TextComponent';
import {appColor} from '../../../constants/appColor';
import { fontFamilies } from '../../../constants/fontFamilies';

const BtnComponent = ({
  text,
  color,
  styles,
  backgroundColor,
  textStyle,
  fontsize,
  borderColor,
  onPress,
  width,
  height,
  fontFamily
}) => {
  return (
    <TouchableOpacity
      style={[
        styless.button,
        {
          backgroundColor: backgroundColor ?? appColor.primary,
          width: width ?? '100%',
          height: height ?? 51,
          borderColor: borderColor ?? appColor.primary,
          ...styles,
        },
      ]}
      onPress={onPress}>
      <TextComponent
        text={text}
        color={color ?? appColor.text}
        styles={{textStyle}}
        fonsize={fontsize ?? 16}
        fontFamily={fontFamily}
      />
    </TouchableOpacity>
  );
};

export default BtnComponent;

const styless = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 4,
  },
});

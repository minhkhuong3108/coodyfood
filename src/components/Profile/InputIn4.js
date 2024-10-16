import {View, TextInput} from 'react-native';
import React from 'react';
import {fontFamilies} from '../../constants/fontFamilies';
import TextComponent from '../TextComponent';
import {appColor} from '../../constants/appColor';

const InputIn4 = ({text, value, onChangeText, error}) => {
  return (
    <View style={{paddingBottom: '5%'}}>
      <TextComponent
        text={text}
        fontFamily={fontFamilies.bold}
        color={error ? appColor.primary : null}
      />
      <TextInput
        style={{
          borderBottomWidth: 1,
          borderColor: error ? appColor.primary : '#CED7DF',
          marginBottom: '1%',
          color: appColor.text,
        }}
        value={value}
        onChangeText={onChangeText}
      />
      {error == '' ? null : (
        <TextComponent text={error} fontsize={12} color={appColor.primary} />
      )}
    </View>
  );
};

export default InputIn4;

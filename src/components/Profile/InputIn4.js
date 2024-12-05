import {View, TextInput} from 'react-native';
import React from 'react';
import {fontFamilies} from '../../constants/fontFamilies';
import TextComponent from '../TextComponent';
import {appColor} from '../../constants/appColor';
import {opacity} from 'react-native-reanimated/lib/typescript/Colors';

const InputIn4 = ({text, value, onChangeText, error, editable,opacity,keyboardType}) => {
  return (
    <View style={{paddingBottom: '5%'}}>
      <TextComponent
        text={text}
        fontFamily={fontFamilies.bold}
        color={error ? appColor.primary : null}
        styles={{opacity: opacity ?? 1}}
      />
      <TextInput
        style={{
          borderBottomWidth: 1,
          borderColor: error ? appColor.primary : '#CED7DF',
          marginBottom: '1%',
          color: appColor.text,
          opacity: opacity ?? 1
        }}
        value={value}
        onChangeText={onChangeText}
        editable={editable ?? true}
        keyboardType={keyboardType ?? 'default'}
      />
      {error == '' ? null : (
        <TextComponent text={error} fontsize={12} color={appColor.primary} />
      )}
    </View>
  );
};

export default InputIn4;

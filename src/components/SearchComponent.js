import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import RowComponent from './RowComponent'
import { appColor } from '../constants/appColor'
import { fontFamilies } from '../constants/fontFamilies'

const SearchComponent = ({ placeholder, value, onchangeText, styles, icon }) => {
    return (
        <RowComponent styles={styless.container}>
            <Image  source={require('../assets/images/home/search.png')} />
            <TextInput
                value={value}
                placeholder={placeholder}
                onChangeText={text => onchangeText(text)}
                placeholderTextColor={appColor.subText}
                style={styless.input}
            />
            
        </RowComponent>
    )
}

export default SearchComponent

const styless = StyleSheet.create({
    input: {
        fontSize: 16,
        fontFamily: fontFamilies.medium,
        color: appColor.text,
        paddingHorizontal: 10,
        width:'100%'
    },
    container: {
        flex:1,
        height: 50,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: appColor.gray,
        borderRadius: 10,
    }
})
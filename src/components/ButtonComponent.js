import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TextComponent from './TextComponent'
import { appColor } from '../constants/appColor'

const ButtonComponent = ({ text, color, styles, backgroundColor, textStyle, fontsize, borderColor, icon, onPress, width, height, type, image, imageStyle }) => {
    return (
        type == 'link' ?
            <TouchableOpacity onPress={onPress} style={styles}>
                {image ? <Image source={image} style={imageStyle} /> :
                    <TextComponent
                        text={text}
                        color={color ?? appColor.text}
                        fonsize={fontsize ?? 16}
                        styles={textStyle}
                    />}
            </TouchableOpacity> :
            <TouchableOpacity
                style={[styless.button, {
                    backgroundColor: backgroundColor ?? appColor.primary,
                    width: width ?? '100%',
                    height: height ?? 60,
                    borderColor: borderColor ?? appColor.primary,
                    ...styles
                }]}
                onPress={onPress}
            >
                {icon && icon}
                <TextComponent
                    text={text}
                    color={color ?? appColor.text}
                    styles={[textStyle, { marginLeft: icon ? 20 : 0 }]}
                    fonsize={fontsize ?? 16}
                />
            </TouchableOpacity>


    )
}

export default ButtonComponent

const styless = StyleSheet.create({
    button: {
        flexDirection: 'row',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: 'rgba(0,0,0,0.5)',
        elevation: 6
    }
})
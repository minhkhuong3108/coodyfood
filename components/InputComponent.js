import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { appColor } from '../src/constants/appColor'
import { Eye, EyeSlash } from 'iconsax-react-native'
import { fontFamilies } from '../src/constants/fontFamilies'
import { TextInput } from 'react-native-paper'

const InputComponent = ({ value, onChangeText, placeholder, isPassword, styles, affix, suffix, label, type, error }) => {
    const [isShowPassword, setIsShowPassword] = useState(isPassword ?? false)
    return (

        <TextInput
            label={label}
            value={value}
            placeholderTextColor={appColor.subText}
            onChangeText={text => onChangeText(text)}
            placeholder={placeholder}
            secureTextEntry={isShowPassword}
            style={[styless.input]}
            mode='outlined'
            outlineColor={error ? appColor.primary : appColor.subText}
            theme={{
                roundness: 10,
                colors: {
                    primary: error ? appColor.primary : appColor.text,
                    background: appColor.white,
                }
            }}
            right={isPassword && (
                <TextInput.Icon
                    icon={() => (
                        <TouchableOpacity style={{ zIndex: 2 }} onPress={() => setIsShowPassword(!isShowPassword)}>
                            {isShowPassword ? (
                                <EyeSlash size={22} color={appColor.subText} />
                            ) : (
                                <Eye size={22} color={appColor.subText} />
                            )}
                        </TouchableOpacity>
                    )}
                />
            )
            }
        />

    )
}

export default InputComponent

const styless = StyleSheet.create({
    input: {
        height: 60,
        fontSize: 16,
        fontFamily: fontFamilies.medium,
        color: appColor.text,
        // borderWidth:1,
        // borderRadius: 20,

    },
    // container: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     borderWidth: 1,
    //     borderColor: appColor.subText,
    //     height: 60,
    //     width: '100%',
    //     borderRadius: 10,
    //     paddingHorizontal: 20
    // }
})
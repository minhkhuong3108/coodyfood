import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ContainerComponent from '../../components/ContainerComponent'
import SpaceComponent from '../../components/SpaceComponent'
import TextComponent from '../../components/TextComponent'
import RowComponent from '../../components/RowComponent'
import { appColor } from '../../constants/appColor'
import InputComponent from '../../components/InputComponent'
import ButtonComponent from '../../components/ButtonComponent'
import { globalStyle } from '../../styles/globalStyle'
import { fontFamilies } from '../../constants/fontFamilies'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    return (
        <ContainerComponent styles={globalStyle.container}>
            <SpaceComponent height={50} />
            <Image source={require('../../assets/images/auth/login-regis/logo.png')} />
            <SpaceComponent height={30} />
            <RowComponent >
                <TextComponent text={'Quên '} fontsize={36} fontFamily={fontFamilies.bold} />
                <TextComponent text={'mật khẩu'} fontsize={36} color={appColor.primary} fontFamily={fontFamilies.bold} />
            </RowComponent>
            <SpaceComponent height={20} />
            <TextComponent text={'Nhập email của bạn để chúng tôi gửi mã OTP để xác minh.'} fontsize={18} fontFamily={fontFamilies.bold} color={appColor.subText} />
            <SpaceComponent height={20} />
            <InputComponent label={'Email'} placeholder={'Nhập email'} value={email} onChangeText={text => setEmail(text)} />
            <SpaceComponent height={30} />
            <ButtonComponent text={'Gửi mã OTP'} color={appColor.white} />
        </ContainerComponent>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({})
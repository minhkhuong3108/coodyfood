import { Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'
import TextComponent from '../../../components/TextComponent'
import { fontFamilies } from '../../constants/fontFamilies'
import { appColor } from '../../constants/appColor'
import RowComponent from '../../../components/RowComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import InputComponent from '../../../components/InputComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { appInfor } from '../../constants/appInfor'
import { globalStyle } from '../../styles/globalStyle'
import ContainerComponent from '../../../components/ContainerComponent'
import { validateEmail, validatePass } from '../../utils/Validators'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../Redux/API/UserAPI'
import LoadingModal from '../../modal/LoadingModal'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('a@gmail.com')
    const [password, setPassword] = useState('123456')
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorPass, setErrorPass] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const { user, status } = useSelector(state => state.login)
    console.log('user', user);
    console.log('status', status);
    console.log('isLoading', isLoading);




    const changeEmail = (data) => {
        setEmail(data)
        setErrorEmail('')
    }
    const changePass = (data) => {
        setPassword(data)
        setErrorPass('')
    }
    const handleLogin = async() => {
        if (!email && !password) {
            setErrorEmail('Email không được để trống')
            setErrorPass('Password không được để trống')
            return
        }
        if (!email) {
            setErrorEmail('Email không được để trống')
            return
        }
        if (!password) {
            setErrorPass('Password không được để trống')
            return
        }
        if (!validateEmail(email)) {
            setErrorEmail('Email không phù hợp')
            return
        }
        if (!validatePass(password)) {
            setErrorPass('Password phải có trên 6 kí tự')
            return
        }
        setIsLoading(true)
        try {
            dispatch(login({ identifier: email, password }))
            // if (status == 'loading') {
            //     setIsLoading(true)
            // }
            if (status == 'success') {
                setIsLoading(false)
                ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT)
            }
        } catch (error) {

        }
    }
    return (
        <ContainerComponent styles={globalStyle.container}>
            <SpaceComponent height={50} />
            <Image source={require('../../assets/images/auth/login-regis/logo.png')} />
            <SpaceComponent height={30} />
            <RowComponent >
                <TextComponent text={'Chào mừng đến với '} fontsize={28} fontFamily={fontFamilies.bold} />
                <TextComponent text={'Coody'} fontsize={28} fontFamily={fontFamilies.bold} color={appColor.primary} />
            </RowComponent>
            <SpaceComponent height={10} />
            <TextComponent text={'Vui lòng nhập thông tin của bạn'} fontFamily={fontFamilies.bold} color={appColor.subText} />
            <SpaceComponent height={40} />
            <InputComponent label={'Email'} placeholder={'Nhập email'} value={email} onChangeText={text => changeEmail(text)} error={errorEmail} />
            {
                errorEmail && <View style={{ marginTop: 5 }}><TextComponent text={errorEmail} color={appColor.primary} fontsize={11} /></View>
            }
            <SpaceComponent height={30} />
            <InputComponent label={'Mật khẩu'} placeholder={'Nhập mật khẩu'} value={password} error={errorPass} onChangeText={text => changePass(text)} isPassword />
            {
                errorPass && <View style={{ marginTop: 5 }}><TextComponent text={errorPass} color={appColor.primary} fontsize={11} /></View>
            }
            <SpaceComponent height={12} />
            <RowComponent justifyContent='flex-end'>
                <ButtonComponent type={'link'} text={'Quên mật khẩu?'} fontsize={14} />
            </RowComponent>
            <SpaceComponent height={30} />
            <ButtonComponent text={'Đăng nhập'} color={appColor.white} onPress={handleLogin} />
            <SpaceComponent height={20} />
            <ButtonComponent text={'Đăng ký'} color={appColor.primary} backgroundColor={appColor.white} onPress={() => navigation.navigate('Register')} />
            <SpaceComponent height={30} />
            <TextComponent text={'Hoặc đăng nhập bằng'} color={appColor.subText} textAlign='center' />
            <SpaceComponent height={30} />
            <RowComponent justifyContent='space-between'>
                <ButtonComponent
                    width={appInfor.sizes.width * 0.37}
                    height={51}
                    icon={<Image source={require('../../assets/images/auth/login-regis/gg.png')} />}
                    text={'Google'}
                    backgroundColor={appColor.white}
                    borderColor={appColor.subText}
                />
                <ButtonComponent
                    width={appInfor.sizes.width * 0.37}
                    height={51}
                    icon={<Image source={require('../../assets/images/auth/login-regis/fb.png')} />}
                    text={'Facebook'}
                    backgroundColor={appColor.white}
                    borderColor={appColor.subText}
                />
            </RowComponent>
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    )
}

export default LoginScreen

const styles = StyleSheet.create({})
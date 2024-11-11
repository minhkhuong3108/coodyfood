import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import { globalStyle } from '../../../styles/globalStyle'
import SpaceComponent from '../../../components/SpaceComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import { fontFamilies } from '../../../constants/fontFamilies'
import { appColor } from '../../../constants/appColor'
import InputComponent from '../../../components/InputComponent'
import { validatePass } from '../../../utils/Validators'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../../components/ButtonComponent'
import bcryptjs from 'bcryptjs'
import HeaderComponent from '../../../components/HeaderComponent'
import LoadingModal from '../../../modal/LoadingModal'
import { updateProfile } from '../../../Redux/API/UserAPI'
import AxiosInstance from '../../../helpers/AxiosInstance'
import AlertNoChoiceModal from '../../../modal/AlertNoChoiceModal'
import { logout } from '../../../Redux/Reducers/LoginSlice'

const ChangePasswordScreen = () => {
    const { user } = useSelector(state => state.login)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [reNewPassword, setReNewPassword] = useState('')
    const [errorPass, setErrorPass] = useState(null)
    const [errorNewPass, setErrorNewPass] = useState(null)
    const [errorReNewPass, setErrorReNewPass] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false)
    console.log('user', user);
    


    const changePass = (data) => {
        setPassword(data)
        setErrorPass('')
    }
    const changeNewPass = (data) => {
        setNewPassword(data)
        setErrorNewPass('')
    }
    const changeReNewPass = (data) => {
        setReNewPassword(data)
        setErrorReNewPass('')
    }

    const handleChangePass = async () => {
        if (!password && !newPassword && !reNewPassword) {
            setErrorPass('Mật khẩu không được để trống')
            setErrorNewPass('Mật khẩu mới không được để trống')
            setErrorReNewPass('Nhập lại mật khẩu mới không được để trống')
            return
        }
        if (!password) {
            setErrorPass('Mật khẩu không được để trống')
            return
        }
        setIsLoading(true)
        const isMatch = await bcryptjs.compare(password, user.password)
        setIsLoading(false)
        if (!isMatch) {
            setErrorPass('Mật khẩu hiện tại không đúng')
            return
        }
        if (password === newPassword) {
            setErrorNewPass('Mật khẩu mới không được trùng với mật khẩu cũ')
            return
        }
        if (!newPassword) {
            setErrorNewPass('Mật khẩu mới không được để trống')
            return
        }
        if (!reNewPassword) {
            setErrorReNewPass('Nhập lại mật khẩu mới không được để trống')
            return
        }
        if (!validatePass(newPassword)) {
            setErrorNewPass('Mật khẩu phải chứa ít nhất 6 ký tự')
        }
        if (newPassword !== reNewPassword) {
            setErrorReNewPass('Mật khẩu mới không trùng khớp')
            return
        }
        try {
            setIsLoading(true)
            const data = {
                email: user.email,
                password: newPassword
            }
            const response = await AxiosInstance().post(`users/reset-password`, data)
            if (response.status == true) {
                setVisible(true)
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoading(false)
        }
    }
    const handleLogout = () => {
        setVisible(false)
        dispatch(logout())
    }
    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent isback={true} />
            <Image source={require('../../../assets/images/auth/login-regis/logo.png')} />
            <SpaceComponent height={30} />
            <RowComponent >
                <TextComponent text={'Coody '} fontsize={28} fontFamily={fontFamilies.bold} color={appColor.primary} />
                <TextComponent text={'Xin Chào'} fontsize={28} fontFamily={fontFamilies.bold} />
            </RowComponent>
            <SpaceComponent height={10} />
            <TextComponent text={'Vui lòng nhập thông tin của bạn'} fontFamily={fontFamilies.bold} color={appColor.subText} />
            <SpaceComponent height={40} />
            <InputComponent label={'Mật khẩu hiện tại'} placeholder={'Nhập mật khẩu hiện tại'}
                value={password} onChangeText={text => changePass(text)} error={errorPass} isPassword />
            {
                errorPass && <View style={{ marginTop: 5 }}><TextComponent text={errorPass} color={appColor.primary} fontsize={11} /></View>
            }
            <SpaceComponent height={30} />
            <InputComponent label={'Mật khẩu mới'} placeholder={'Nhập mật khẩu mới'}
                value={newPassword} error={errorNewPass} onChangeText={text => changeNewPass(text)} isPassword />
            {
                errorNewPass && <View style={{ marginTop: 5 }}><TextComponent text={errorNewPass} color={appColor.primary} fontsize={11} /></View>
            }
            <SpaceComponent height={30} />
            <InputComponent label={'Nhập lại mật khẩu mới'} placeholder={'Nhập lại mật khẩu mới'}
                value={reNewPassword} error={errorReNewPass} onChangeText={text => changeReNewPass(text)} isPassword />
            {
                errorReNewPass && <View style={{ marginTop: 5 }}><TextComponent text={errorReNewPass} color={appColor.primary} fontsize={11} /></View>
            }
            <SpaceComponent height={30} />
            <ButtonComponent text={'Đổi mật khẩu'} onPress={handleChangePass} color={appColor.white} />
            <LoadingModal visible={isLoading} />
            <AlertNoChoiceModal visible={visible} title={'Thành công'}
                description={'Đổi mật khẩu thành công. Bạn cần đăng nhập lại để tiếp tục mua sắm'}
                onPress={handleLogout} />
        </ContainerComponent>
    )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({})
import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import { globalStyle } from '../../../styles/globalStyle'
import TextComponent from '../../../components/TextComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import InputComponent from '../../../components/InputComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { appColor } from '../../../constants/appColor'

const EditAddressScreen = () => {
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [label, setLabel] = useState('')
    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent text={'Chỉnh sửa địa chỉ'} isback />
            <TextComponent text={'Thông tin địa chỉ'} />
            <SpaceComponent height={20} />
            <InputComponent value={'Athony'} placeholder={'Tên người dùng'} onchangeText={text => setName(text)} />
            <SpaceComponent height={10} />
            <InputComponent value={'0123456789'} placeholder={'Số điện thoại'} onchangeText={text => setPhone(text)} />
            <SpaceComponent height={10} />
            <InputComponent value={'Công Viên Phần Mềm Quang Trung, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh, Việt Nam'}
                placeholder={'Địa chỉ'} onchangeText={text => setAddress(text)} />
            <SpaceComponent height={20} />
            <TextComponent text={'Tên nhãn'} />
            <SpaceComponent height={20} />
            <InputComponent value={'Nhà'} placeholder={'Nhãn'} onChangeText={text => setLabel(text)} />
            <SpaceComponent height={40} />
            <ButtonComponent text={'Xóa địa chỉ'} color={appColor.white} />
            <View style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
                <ButtonComponent text={'Lưu'} color={appColor.white} />
            </View>
        </ContainerComponent>
    )
}

export default EditAddressScreen

const styles = StyleSheet.create({})
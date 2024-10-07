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
import LineComponent from '../../../components/LineComponent'

const AddAddressScreen = ({ navigation, route }) => {
    const { item } = route.params || {}
    // console.log('item',item);

    const address = item
    console.log('address', address);
    
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [label, setLabel] = useState('')
    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent text={'Thêm địa chỉ'} isback />
            <TextComponent text={'Thông tin địa chỉ'} />
            <SpaceComponent height={20} />
            <InputComponent value={name} placeholder={'Tên người dùng'} onChangeText={text => setName(text)} />
            <SpaceComponent height={10} />
            <InputComponent value={phone} placeholder={'Số điện thoại'} onchangeText={text => setPhone(text)} />
            <SpaceComponent height={10} />
            <SpaceComponent height={20} />
            <LineComponent />
            <SpaceComponent height={20} />
            <InputComponent value={address}
                placeholder={'Địa chỉ'} onChangeText={text => setAddress(text)} onPress={() => navigation.navigate('SearchAddress')} />
            <SpaceComponent height={20} />
            <TextComponent text={'Tên nhãn'} />
            <SpaceComponent height={20} />
            <InputComponent value={label} placeholder={'Nhãn'} onChangeText={text => setLabel(text)} />
            <View style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
                <ButtonComponent text={'Thêm mới'} color={appColor.white} />
            </View>
        </ContainerComponent>
    )
}

export default AddAddressScreen

const styles = StyleSheet.create({})
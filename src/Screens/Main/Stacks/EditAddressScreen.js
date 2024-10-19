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
import RowComponent from '../../../components/RowComponent'
import LineComponent from '../../../components/LineComponent'

const EditAddressScreen = ({ navigation, route }) => {
    const { item } = route.params || {}
    const address = item
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [indexLabel, setIndexLabel] = useState(1)

    const labelOption = [
        { id: 1, name: 'Nhà' },
        { id: 2, name: 'Công ty' },
        { id: 3, name: 'Khác' },
    ]
    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent text={'Chỉnh sửa địa chỉ'} isback />
            <TextComponent text={'Thông tin địa chỉ'} />
            <SpaceComponent height={20} />
            <InputComponent value={'Athony'} placeholder={'Tên người dùng'} onchangeText={text => setName(text)} />
            <SpaceComponent height={10} />
            <InputComponent value={'0123456789'} placeholder={'Số điện thoại'} onchangeText={text => setPhone(text)} />
            <SpaceComponent height={10} />
            <SpaceComponent height={20} />
            <LineComponent />
            <SpaceComponent height={20} />
            <InputComponent value={address}
                placeholder={'Địa chỉ'} onPress={() => navigation.navigate('SearchAddress', { targetScreen: 'EditAddress' })} />
            <SpaceComponent height={20} />
            <TextComponent text={'Tên nhãn'} />
            <SpaceComponent height={20} />
            <RowComponent styles={{ width: 400 }}>
                {labelOption.map((item, index) => {
                    return (
                        <View key={item.id} >
                            <ButtonComponent
                                onPress={() => setIndexLabel(item.id)}
                                text={item.name}
                                color={appColor.text}
                                fontsize={12}
                                borderRadius={0}
                                height={30}
                                width={80}
                                backgroundColor={indexLabel === item.id ? appColor.white : appColor.note}
                                borderColor={indexLabel === item.id ? appColor.primary : appColor.note}
                                styles={{ marginRight: 10 }}
                            />
                        </View>
                    )
                }
                )}
            </RowComponent>
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
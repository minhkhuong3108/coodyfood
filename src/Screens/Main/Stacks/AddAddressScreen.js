import { Alert, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import { globalStyle } from '../../../styles/globalStyle'
import TextComponent from '../../../components/TextComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import InputComponent from '../../../components/InputComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { appColor } from '../../../constants/appColor'
import LineComponent from '../../../components/LineComponent'
import RowComponent from '../../../components/RowComponent'
import { useSelector } from 'react-redux'
import { validatePhone } from '../../../utils/Validators'
import AlertChoiceModal from '../../../modal/AlertChoiceModal'
import AxiosInstance from '../../../helpers/AxiosInstance'
import MapAPI from '../../../core/apiMap/MapAPI'
import LoadingModal from '../../../modal/LoadingModal'

const AddAddressScreen = ({ navigation, route }) => {
    const { item } = route.params || {}

    console.log('item', item);

    const address = item

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [indexLabel, setIndexLabel] = useState()
    const [visible, setVisible] = useState(false)
    const [latitude, setLatitude] = useState()
    const [longitude, setLongitude] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const { user } = useSelector(state => state.login)

    useEffect(() => {
        if (user) {
            setName(user.name)
            setPhone(user.phone)
        }
    }, [user])

    useEffect(() => {
        if (labelOption) {
            setIndexLabel(labelOption[0]?.name)
        }
    }, [labelOption])

    const labelOption = [
        { id: 1, name: 'Nhà' },
        { id: 2, name: 'Công ty' },
        { id: 3, name: 'Khác' },
    ]

    const geocoding = async () => {
        try {
            if (address) {
                let geocoding = await MapAPI.getForwardGeocoding({
                    description: encodeURIComponent(address),
                });
                // console.log('geocoding', geocoding.results[0].formatted_address);
                setLatitude(geocoding.results[0].geometry.location.lat)
                setLongitude(geocoding.results[0].geometry.location.lng)

            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        geocoding()
    }, [address])

    const handleValidate = () => {
        if (!name || !phone || !address) {
            ToastAndroid.show('Vui lòng nhập đầy đủ thông tin', ToastAndroid.SHORT)
            return
        }
        if (!validatePhone(phone)) {
            ToastAndroid.show('Số điện thoại không hợp lệ', ToastAndroid.SHORT)
            return
        }
        setVisible(true)
    }
    const handleAddAddress = async () => {
        setIsLoading(true)
        const data = {
            userId: user._id,
            recipientName: name,
            phone,
            address,
            label: indexLabel,
            latitude,
            longitude
        }
        try {
            const response = await AxiosInstance().post('/userAddresses/add', data)
            console.log('response', response);
            if (response.status == true) {
                setIsLoading(false)
                setVisible(false)
                ToastAndroid.show('Thêm địa chỉ thành công', ToastAndroid.SHORT)
                navigation.goBack()
            }
        } catch (error) {
            setIsLoading(false)
            ToastAndroid.show('Thêm địa chỉ thất bại', ToastAndroid.SHORT)
            setVisible(false)
            console.log('error', error);
        }
    }
    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent text={'Thêm địa chỉ'} isback />
            <TextComponent text={'Thông tin địa chỉ'} />
            <SpaceComponent height={20} />
            <InputComponent value={name} placeholder={'Tên người dùng'} onChangeText={text => setName(text)} />
            <SpaceComponent height={10} />
            <InputComponent value={phone} placeholder={'Số điện thoại'} onChangeText={text => setPhone(text)} />
            <SpaceComponent height={10} />
            <SpaceComponent height={20} />
            <LineComponent />
            <SpaceComponent height={20} />
            <InputComponent value={address}
                placeholder={'Địa chỉ'} onPress={() => navigation.navigate('SearchAddress', { targetScreen: 'AddAddress' })} />
            <SpaceComponent height={20} />
            <TextComponent text={'Tên nhãn'} />
            <SpaceComponent height={20} />
            <RowComponent styles={{ width: 400 }}>
                {labelOption.map((item, index) => {
                    return (
                        <View key={item.id} >
                            <ButtonComponent
                                onPress={() => setIndexLabel(item.name)}
                                text={item.name}
                                color={appColor.text}
                                fontsize={12}
                                borderRadius={0}
                                height={30}
                                width={80}
                                backgroundColor={indexLabel === item.name ? appColor.white : appColor.note}
                                borderColor={indexLabel === item.name ? appColor.primary : appColor.note}
                                styles={{ marginRight: 10 }}
                            />
                            {/* <SpaceComponent width={20} /> */}
                        </View>
                    )
                }
                )}
            </RowComponent>
            <View style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
                <ButtonComponent text={'Thêm mới'} color={appColor.white} onPress={handleValidate} />
            </View>
            <AlertChoiceModal title={'Bạn có muốn thêm địa chỉ mới không?'}
                visible={visible} onClose={() => setVisible(false)} onPress={handleAddAddress} />
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    )
}

export default AddAddressScreen

const styles = StyleSheet.create({})
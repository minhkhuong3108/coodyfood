import { StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { validatePhone } from '../../../utils/Validators'
import MapAPI from '../../../core/apiMap/MapAPI'
import AlertChoiceModal from '../../../modal/AlertChoiceModal'
import AxiosInstance from '../../../helpers/AxiosInstance'
import LoadingModal from '../../../modal/LoadingModal'

const EditAddressScreen = ({ navigation, route }) => {
    const { item, addressInfo } = route.params || {}
    console.log('addressInfo', addressInfo);

    const id = addressInfo._id
    const address = item || addressInfo.address
    const [name, setName] = useState(addressInfo?.recipientName)
    const [phone, setPhone] = useState(addressInfo?.phone)
    const [indexLabel, setIndexLabel] = useState(addressInfo?.label)
    const [latitude, setLatitude] = useState(addressInfo?.latitude)
    const [longitude, setLongitude] = useState(addressInfo?.longitude)
    const [visible, setVisible] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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
        setTitle('Bạn có chắc muốn cập nhật địa chỉ này không?')
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

    const handleUpdateAddress = async () => {
        setIsLoading(true)
        const data = {
            recipientName: name,
            phone,
            address,
            latitude,
            longitude,
            label: indexLabel,
        }
        try {
            const response = await AxiosInstance().put(`/userAddresses/update/${id}`, data)
            console.log('response', response);
            if (response.status == true) {
                setIsLoading(false)
                setVisible(false)
                ToastAndroid.show('Cập nhật địa chỉ thành công', ToastAndroid.SHORT)
                navigation.goBack()
            }
        } catch (error) {
            setIsLoading(false)
            setVisible(false)
            ToastAndroid.show('Cập nhật địa chỉ thất bại', ToastAndroid.SHORT)
            console.log('error', error);
        }
    }

    const handleDeleteAddress = async () => {
        setIsLoading(true)
        try {
            const response = await AxiosInstance().delete(`/userAddresses/delete/${id}`)
            console.log('response', response);
            if (response.status == true) {
                setIsLoading(false)
                setVisible(false)
                ToastAndroid.show('Xóa địa chỉ thành công', ToastAndroid.SHORT)
                navigation.goBack()
                // navigation.navigate('Address')
            }
        } catch (error) {
            setIsLoading(false)
            ToastAndroid.show('Xóa địa chỉ thất bại', ToastAndroid.SHORT)
            setVisible(false)
            console.log('error', error);
        }
    }
    const handleShowAlert = () => {
        setTitle('Bạn có chắc muốn xóa địa chỉ này không?')
        setIsDelete(true)
        setVisible(true)
    }
    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent text={'Chỉnh sửa địa chỉ'} isback />
            <TextComponent text={'Thông tin địa chỉ'} />
            <SpaceComponent height={20} />
            <InputComponent value={name} placeholder={'Tên người dùng'} onchangeText={text => setName(text)} />
            <SpaceComponent height={10} />
            <InputComponent value={phone} placeholder={'Số điện thoại'} onchangeText={text => setPhone(text)} />
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
                        </View>
                    )
                }
                )}
            </RowComponent>
            <SpaceComponent height={40} />
            <ButtonComponent text={'Xóa địa chỉ'} color={appColor.white} onPress={handleShowAlert} />
            <View style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
                <ButtonComponent text={'Lưu'} color={appColor.white} onPress={handleValidate} />
            </View>
            <AlertChoiceModal title={title}
                visible={visible} onClose={() => setVisible(false)}
                onPress={isDelete ? handleDeleteAddress : handleUpdateAddress} />
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    )
}

export default EditAddressScreen

const styles = StyleSheet.create({})
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import { globalStyle } from '../../../styles/globalStyle'
import HeaderComponent from '../../../components/HeaderComponent'
import SearchComponent from '../../../components/SearchComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import LineComponent from '../../../components/LineComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import { appColor } from '../../../constants/appColor'
import ButtonComponent from '../../../components/ButtonComponent'
import AddressItem from '../../../components/AddressItem'
import { useSelector } from 'react-redux'
import AxiosInstance from '../../../helpers/AxiosInstance'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LoadingModal from '../../../modal/LoadingModal'
import { appInfor } from '../../../constants/appInfor'

const AddressScreen = ({ navigation }) => {
    const [address, setAddress] = useState([])
    const { user } = useSelector(state => state.login)
    const [currentAddress, setCurrentAddress] = useState()
    const [isLoading, setIsLoading] = useState(false)
    console.log('address', address);
    console.log('currentAddress', currentAddress);



    // console.log('address', address);


    const getAddressUser = async () => {
        setIsLoading(true)
        try {
            const response = await AxiosInstance().get(`/userAddresses/${user._id}`)
            setIsLoading(false)
            setAddress(response.data)
        } catch (error) {
            setIsLoading(false)
            console.log('error', error);
        }
    }

    const loadCurrentAddress = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@current_address');
            if (jsonValue != null) {
                setCurrentAddress(JSON.parse(jsonValue));
            }
            if (jsonValue == null) {
                setCurrentAddress(address[0]);
            }
        } catch (error) {
            console.log('Error loading current address:', error);
        }
    }

    const saveCurrentAddress = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@current_address', jsonValue);
        } catch (error) {
            console.log('Error saving current address:', error);
        }
    };

    const handleSelectAddress = (item) => {
        const selectedAddress = {
            _id: item._id,
            title: item.label,
            address: item.address,
            name: item.recipientName,
            phone: item.phone
        };
        setCurrentAddress(selectedAddress);
        saveCurrentAddress(selectedAddress); // Lưu địa chỉ hiện tại vào AsyncStorage
    };

    useEffect(() => {
        if (address.length == 1) {
            setCurrentAddress({
                title: address[0].label,
                address: address[0].address,
                name: address[0].recipientName,
                phone: address[0].phone
            });
            saveCurrentAddress({
                title: address[0].label,
                address: address[0].address,
                name: address[0].recipientName,
                phone: address[0].phone
            });
        }
    }, [address]);


    useFocusEffect(
        useCallback(() => {
            getAddressUser(); // Tải lại dữ liệu khi trang được focus
            loadCurrentAddress(); // Load địa chỉ hiện tại từ AsyncStorage
        }, [])
    );

    return (
        <ContainerComponent styles={globalStyle.container} isScroll>
            <HeaderComponent text={'Địa chỉ'} isback />
            {/* <SearchComponent placeholder={'Tìm kiếm'} value={search} onchangeText={text => setSearch(text)} />
            <SpaceComponent height={10} />
            <LineComponent />
            <SpaceComponent height={10} /> */}
            {address.length > 0 ? <View>

                <RowComponent>
                    <Image source={require('../../../assets/images/address/location.png')} />
                    <SpaceComponent width={8} />
                    <TextComponent text={'Địa chỉ hiện tại'} fontsize={20} />
                </RowComponent>
                <SpaceComponent height={20} />
                {currentAddress && <AddressItem title={currentAddress.title}
                    address={currentAddress.address} name={currentAddress.name} phone={currentAddress.phone} />}
                <SpaceComponent height={10} />
                <LineComponent />
                <SpaceComponent height={10} />
                <RowComponent>
                    <Image source={require('../../../assets/images/address/save.png')} />
                    <SpaceComponent width={8} />
                    <TextComponent text={'Địa chỉ đã lưu'} fontsize={20} />
                </RowComponent>
                <SpaceComponent height={20} />
                {/* <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            data={address}
            renderItem={({item}) => 
            <AddressItem title={item.title} address={item.address} name={item.name} phone={item.phone} edit />}
            keyExtractor={item => item.id}
            /> */}
                {address && address.map((item, index) => (
                    <AddressItem key={index} title={item.label}
                        address={item.address} name={item.recipientName}
                        phone={item.phone} save
                        onPressEdit={() => navigation.navigate('EditAddress', { addressInfo: item })}
                        onPress={() => handleSelectAddress(item)} />
                ))}
                <SpaceComponent height={20} />

            </View> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <SpaceComponent height={appInfor.sizes.height * 0.2} />
                    <Image source={require('../../../assets/images/address/address.png')} style={{ width: 100, height: 100 }} />
                    <SpaceComponent height={40} />
                    <TextComponent text={'Không có địa chỉ nào'} fontsize={20} />
                    <SpaceComponent height={40} />
                </View>
            }
            <ButtonComponent text={'Thêm địa chỉ mới'}
                color={appColor.white}
                onPress={() => navigation.navigate('AddAddress', { userId: user._id })} />
            <LoadingModal visible={isLoading} />
            <SpaceComponent height={70} />
        </ContainerComponent>
    )
}

export default AddressScreen

const styles = StyleSheet.create({

})
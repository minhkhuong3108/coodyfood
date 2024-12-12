import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import { appColor } from '../../../constants/appColor'
import { fontFamilies } from '../../../constants/fontFamilies'
import SpaceComponent from '../../../components/SpaceComponent'
import LineComponent from '../../../components/LineComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { globalStyle } from '../../../styles/globalStyle'
import AxiosInstance from '../../../helpers/AxiosInstance'
import { formatVoucherPrice } from '../../../components/format/FormatVoucherPrice'
import { formatDate } from '../../../components/format/FormatDate'

const TicketSaleScreen = ({ navigation, route }) => {
    const { data } = route.params
    const { totalPrice } = route.params
    const [voucher, setVoucher] = useState([])
    console.log('data', data);

    console.log('voucher', voucher);


    const getVoucher = async () => {
        const response = await AxiosInstance().get(`/voucher/available/${totalPrice}`)
        console.log('response', response.data);
        setVoucher(response.data)
    }
    useEffect(() => {
        getVoucher()
    }, [])
    const renderItem = ({ item }) => {
        const { expirationDate, discountAmount, minimumOrderAmount } = item
        return (
            <View style={styles.containerItem}>
                <RowComponent justifyContent={'space-between'}>
                    <TextComponent text={'Mã giảm giá'} fontsize={18} color={appColor.primary} fontFamily={fontFamilies.bold} />
                    <RowComponent>
                        <TextComponent text={'HSD: '} fontsize={12} />
                        <TextComponent text={formatDate(expirationDate)} fontsize={12} />
                    </RowComponent>
                </RowComponent>
                <SpaceComponent height={7} />
                <LineComponent />
                <SpaceComponent height={12} />
                <RowComponent justifyContent={'space-between'}>
                    <RowComponent>
                        <Image source={require('../../../assets/images/ticketSale/logo.png')} />
                        <SpaceComponent width={20} />
                        <TextComponent
                            text={`Giảm ${formatVoucherPrice(discountAmount)} tổng tiền món ăn. 
                            \n Đơn hàng tối thiểu ${formatVoucherPrice(minimumOrderAmount)}.`}
                            fontsize={13} fontFamily={fontFamilies.bold} />
                    </RowComponent>
                    <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                        <ButtonComponent text={'Sử dụng'} width={60} height={25}
                            color={appColor.white} fontsize={10} borderRadius={5}
                            onPress={() => {
                                navigation.navigate('CheckOut', { sale: item, data })
                            }} />
                    </View>
                </RowComponent>
            </View>
        )
    }
    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent isback text={'Phiếu giảm giá'} />
            {voucher.length > 0 ? <FlatList
                showsVerticalScrollIndicator={false}
                data={voucher}
                renderItem={renderItem}
                keyExtractor={item => item._id}
            /> :
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../../assets/images/ticketSale/voucher.png')} />
                    <SpaceComponent height={20} />
                    <TextComponent text={'Hiện tại không có phiếu giảm giá nào phù hợp với đơn hàng của bạn'}
                     color={appColor.subText} fontsize={14} textAlign={'center'}/>
                </View>}
        </ContainerComponent>
    )
}

export default TicketSaleScreen

const styles = StyleSheet.create({
    containerItem: {
        padding: 15,
        backgroundColor: appColor.white,
        borderWidth: 1,
        borderColor: appColor.gray,
        borderRadius: 15,
        marginBottom: 20
    },
})
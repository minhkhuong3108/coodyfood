import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import { fontFamilies } from '../../../constants/fontFamilies'
import ButtonComponent from '../../../components/ButtonComponent'
import { appColor } from '../../../constants/appColor'
import SpaceComponent from '../../../components/SpaceComponent'
import { globalStyle } from '../../../styles/globalStyle'
import OrderItem from '../../../components/OrderItem'
import LineComponent from '../../../components/LineComponent'

const CheckOutScreen = () => {
    const [order, setOrder] = useState(ORDER)
    const [indexPay, setIndexPay] = useState()
    console.log('indexPay', indexPay);

    const options = [
        {
            name: 'ZaloPay',
            image: require('../../../assets/images/checkout/zalo.png')
        },
        {
            name: 'Visa',
            image: require('../../../assets/images/checkout/visa.png')
        },
        {
            name: 'Tiền mặt',
            image: require('../../../assets/images/checkout/cash.png')
        },
    ]
    return (
        <ContainerComponent styles={globalStyle.container} isScroll={true}>
            <HeaderComponent text='Thanh toán' isback />
            <View style={[styles.containerAddress, globalStyle.shawdow]}>
                <RowComponent justifyContent={'space-between'}>
                    <TextComponent text={'Địa chỉ giao hàng'} fontsize={14} fontFamily={fontFamilies.bold} />
                    <ButtonComponent type={'link'} text={'Sửa'} color={appColor.primary} fontsize={14} />
                </RowComponent>
                <SpaceComponent height={10} />
                <TextComponent text={`Olala | 0912345678`} fontsize={12} />
                <SpaceComponent height={10} />
                <TextComponent text={`26, Duong So 2, Thao Dien Ward, An Phu, District 2, Ho Chi Minh city`} fontsize={12} width={280} />
            </View>
            <SpaceComponent height={15} />
            <RowComponent justifyContent={'space-between'}>
                <TextComponent text={'Sản phẩm'} fontsize={20} fontFamily={fontFamilies.bold} />
                <ButtonComponent
                    width={132} height={30} borderColor={appColor.subText} backgroundColor={appColor.white}
                    text={'Thêm voucher'} fontsize={11}
                />
            </RowComponent>
            <SpaceComponent height={20} />
            <RowComponent justifyContent={'space-between'}>
                <TextComponent text={'Tên cửa hàng'} fontsize={14} fontFamily={fontFamilies.bold} />
                <ButtonComponent type={'link'} text={'Thêm món'} fontsize={14} color={appColor.primary} />
            </RowComponent>
            <SpaceComponent height={10} />
            <View>
                <FlatList
                    scrollEnabled={false}
                    data={order}
                    renderItem={({ item }) => <OrderItem item={item} />}
                    keyExtractor={item => item._id}
                />
            </View>
            <LineComponent />
            <SpaceComponent height={15} />
            <TextComponent text={'Phương thức thanh toán'} fontsize={20} fontFamily={fontFamilies.bold} />
            <SpaceComponent height={15} />
            {options.map((item, index) => (
                <TouchableOpacity key={index} style={styles.btnRow} onPress={() => setIndexPay(index)}>
                    <View style={[styles.circle, index == indexPay && styles.activeCircle]} />
                    <SpaceComponent width={20} />
                    <Image source={item.image} />
                    <SpaceComponent width={10} />
                    <TextComponent text={item.name} />
                </TouchableOpacity>
            ))}
            <SpaceComponent height={10} />
            <LineComponent />
            <SpaceComponent height={10} />
            <RowComponent justifyContent={'space-between'}>
                <TextComponent text={'Tổng cộng'} fontsize={16} />
                <TextComponent text={'500.000 đ'} fontsize={16} fontFamily={fontFamilies.bold} />
            </RowComponent>
            <SpaceComponent height={10} />
            <RowComponent justifyContent={'space-between'}>
                <TextComponent text={'Mã khuyến mãi'} fontsize={16} />
                <TextComponent text={'0 đ'} fontsize={16} fontFamily={fontFamilies.bold} />
            </RowComponent>
            <SpaceComponent height={10} />
            <RowComponent justifyContent={'space-between'}>
                <TextComponent text={'Phí giao hàng'} fontsize={16} color={appColor.green} />
                <TextComponent text={'0đ'} fontsize={16} fontFamily={fontFamilies.bold} color={appColor.green} />
            </RowComponent>
            <SpaceComponent height={15} />
            <LineComponent />
            <SpaceComponent height={20} />
            <RowComponent justifyContent={'space-between'}>
                <TextComponent text={'Tổng tiền'} fontsize={18} fontFamily={fontFamilies.bold} />
                <TextComponent text={'500.000 đ'} fontsize={14} fontFamily={fontFamilies.bold} />
            </RowComponent>
            <SpaceComponent height={15} />
            <ButtonComponent text={'Đặt hàng'} height={60} color={appColor.white} />
            <SpaceComponent height={70}/>
        </ContainerComponent>
    )
}

export default CheckOutScreen

const styles = StyleSheet.create({
    activeCircle: {
        backgroundColor: appColor.primary,
        borderColor: appColor.primary,
    },
    circle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: appColor.text,
        backgroundColor: appColor.white
    },
    btnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    containerAddress: {
        padding: 15,
        backgroundColor: appColor.opacity,
        borderRadius: 10
    }
})

var ORDER = [
    {
        '_id': 1,
        name: 'Cơm gà',
        price: 250,
        quantity: 1,
        image: require('../../../assets/images/checkout/p1.png'),
        note: 'Không ớt'
    },
    {
        '_id': 2,
        name: 'Cơm gà',
        price: 250,
        quantity: 1,
        image: require('../../../assets/images/checkout/p1.png'),
        note: 'Không ớt'
    },
]
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import TextComponent from '../../../components/TextComponent'
import { fontFamilies } from '../../../constants/fontFamilies'
import { appColor } from '../../../constants/appColor'
import SpaceComponent from '../../../components/SpaceComponent'
import { globalStyle } from '../../../styles/globalStyle'
import RowComponent from '../../../components/RowComponent'
import OrderItem from '../../../components/OrderItem'
import ButtonComponent from '../../../components/ButtonComponent'
import LineComponent from '../../../components/LineComponent'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'

const CheckOrderScreen = ({ navigation, route }) => {
    const { item } = route.params
    console.log('item', item);
    const data = item.items
    const [imagePayment, setImagePayment] = useState('')
    const [indexPay, setIndexPay] = useState(2)
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt')

    const snapPoint = ['50%']
    const bottomSheetRef = useRef(null)
    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.expand()
    }
    const handleCloseBottomSheet = () => {
        bottomSheetRef.current?.close()
    }

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
        )
    )

    const options = [
        {
            name: 'ZaloPay',
            image: require('../../../assets/images/checkout/zalo.png')
        },
        {
            name: 'PayOS',
            image: require('../../../assets/images/checkout/payos.png')
        },
        {
            name: 'Tiền mặt',
            image: require('../../../assets/images/checkout/cash.png')
        },
    ]


    const handlePayment = () => {
        if (item.paymentMethod == 'ZaloPay') {
            setImagePayment(require('../../../assets/images/checkout/zalo.png'))
        }
        else if (item.paymentMethod == 'PayOS') {
            setImagePayment(require('../../../assets/images/checkout/payos.png'))
        }
        else {
            setImagePayment(require('../../../assets/images/checkout/cash.png'))
        }
    }

    useEffect(() => {
        handlePayment()
    }, [item.paymentMethod])

    return (
        <ContainerComponent styles={{ flex: 1, backgroundColor: appColor.white }}>
            <ContainerComponent styles={globalStyle.container} isScroll>
                <HeaderComponent text={'Đơn hàng chi tiết'} isback />
                {item.status !== 'Đang giao hàng' ?
                    <View style={[styles.viewWait, globalStyle.shawdow]}>
                        <TextComponent text={'Đang xử lý đơn hàng của bạn...'}
                            fontsize={22} fontFamily={fontFamilies.bold} color={appColor.primary} textAlign={'center'} />
                        <SpaceComponent height={10} />
                        <TextComponent text={'Vui lòng chờ trong giây lát'} color={appColor.subText} textAlign={'center'} />
                    </View> :
                    <RowComponent justifyContent={'space-between'} styles={[styles.viewShipper, globalStyle.shawdow]}>
                        <RowComponent>
                            <Image style={styles.imgShipper} source={require('../../../assets/images/checkOrder/avatar.png')} />
                            <SpaceComponent width={10} />
                            <View>
                                <TextComponent text={'Nguyễn Văn A'} fontsize={18} />
                                <SpaceComponent height={20} />
                                <RowComponent>
                                    <TextComponent text={`Đánh giá: 5 `} fontsize={14} />
                                    <Image source={require('../../../assets/images/checkOrder/star.png')} />
                                </RowComponent>
                            </View>
                        </RowComponent>
                        <RowComponent>
                            <ButtonComponent type={'link'} image={require('../../../assets/images/checkOrder/call.png')} />
                            <SpaceComponent width={10} />
                            <ButtonComponent type={'link'} image={require('../../../assets/images/checkOrder/chat.png')} />
                        </RowComponent>
                    </RowComponent>
                }

                <SpaceComponent height={20} />
                <TextComponent text={item.status}
                    color={appColor.primary} fontsize={20} textAlign={'center'} fontFamily={fontFamilies.semiBold} />
                <SpaceComponent height={20} />
                <View style={[styles.viewAddress, globalStyle.shawdow]}>
                    <RowComponent>
                        <Image source={require('../../../assets/images/checkOrder/shop.png')} />
                        <SpaceComponent width={15} />
                        <View>
                            <TextComponent text={'Địa chỉ nhà hàng'} fontFamily={fontFamilies.bold} />
                            <SpaceComponent height={5} />
                            <TextComponent width={280} text={item.shopOwner.address}
                                fontsize={12} color={appColor.subText} />
                        </View>
                    </RowComponent>
                    <SpaceComponent height={10} />
                    <RowComponent>
                        <Image source={require('../../../assets/images/checkOrder/home.png')} />
                        <SpaceComponent width={15} />
                        <View>
                            <TextComponent text={'Địa chỉ đặt hàng'} fontFamily={fontFamilies.bold} />
                            <SpaceComponent height={5} />
                            <TextComponent width={280} text={item.shippingAddress.address}
                                fontsize={12} color={appColor.subText} />
                        </View>
                    </RowComponent>
                </View>
                <SpaceComponent height={20} />
                <View style={[styles.viewProduct, globalStyle.shawdow]}>
                    <TextComponent text={'Danh sách món'} fontsize={20} fontFamily={fontFamilies.bold} />
                    <SpaceComponent height={20} />
                    <FlatList
                        scrollEnabled={false}
                        data={data}
                        renderItem={({ item }) => <OrderItem noTouch item={item} />}
                        keyExtractor={item => item._id}
                    />
                </View>
                <SpaceComponent height={10} />
                <RowComponent justifyContent={'space-between'} styles={[styles.viewPay, globalStyle.shawdow]}>
                    <TextComponent text={'Phương thức thanh toán'} fontsize={14} fontFamily={fontFamilies.bold} />
                    <RowComponent >
                        <TextComponent text={item.paymentMethod} fontsize={14} fontFamily={fontFamilies.bold} />
                        <SpaceComponent width={4} />
                        {imagePayment && <Image source={imagePayment} />}
                    </RowComponent>
                </RowComponent>
                <SpaceComponent height={10} />
                {item.status == 'Chờ thanh toán' ?
                    <RowComponent justifyContent={'space-between'} >
                        <ButtonComponent text={'HỦY ĐƠN HÀNG'} backgroundColor={appColor.white} borderColor={appColor.white} width={'48%'} />
                        <ButtonComponent text={'THANH TOÁN'} color={appColor.white} width={'48%'}
                            onPress={handleOpenBottomSheet} />
                    </RowComponent> :
                    <ButtonComponent text={'HỦY ĐƠN HÀNG'} color={appColor.white} />
                }
                <SpaceComponent height={10} />
                <View style={[styles.viewPrice, globalStyle.shawdow]}>
                    <TextComponent text={'Tóm tắt thanh toán'} fontFamily={fontFamilies.bold} />
                    <SpaceComponent height={15} />
                    <View style={{ paddingHorizontal: 10 }}>
                        <RowComponent justifyContent={'space-between'}>
                            <TextComponent text={'Tạm tính'} />
                            <TextComponent text={item.totalPrice} />
                        </RowComponent>
                        <SpaceComponent height={10} />
                        <RowComponent justifyContent={'space-between'}>
                            <TextComponent text={'Phí giao hàng'} />
                            <TextComponent text={'50.000 đ'} />
                        </RowComponent>
                        <SpaceComponent height={10} />
                        <RowComponent justifyContent={'space-between'}>
                            <TextComponent text={'Mã giảm giá'} />
                            <TextComponent text={'50.000 đ'} />
                        </RowComponent>
                    </View>
                    <SpaceComponent height={15} />
                    <LineComponent />
                    <SpaceComponent height={10} />
                    <RowComponent justifyContent={'space-between'}>
                        <TextComponent text={'Tổng cộng'} fontsize={18} fontFamily={fontFamilies.bold} />
                        <TextComponent text={'600.000 đ'} fontsize={18} fontFamily={fontFamilies.bold} />
                    </RowComponent>
                </View>
                <SpaceComponent height={70} />
            </ContainerComponent>
            <BottomSheet
                enablePanDownToClose
                ref={bottomSheetRef}
                snapPoints={snapPoint}
                backdropComponent={renderBackdrop}
                index={-1}
            >
               <ContainerComponent styles={styles.btsContainer}>
               <TextComponent text={'Chọn phương thức thanh toán'} fontsize={18} fontFamily={fontFamilies.bold} />
                <SpaceComponent height={20} />
                {options.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.btnRow} onPress={() => { setIndexPay(index), setPaymentMethod(item.name) }}>
                        <View style={[styles.circleContainer,index == indexPay && styles.activeCircleContainer]} >
                            <View style={[styles.circle, index == indexPay && styles.activeCircle]} />
                        </View>
                        <SpaceComponent width={20} />
                        <Image source={item.image} />
                        <SpaceComponent width={10} />
                        <TextComponent text={item.name} />
                    </TouchableOpacity>
                ))}
                <SpaceComponent height={20} />
                <LineComponent />
                <SpaceComponent height={20} />
                <RowComponent justifyContent={'space-between'}>
                    <TextComponent text={'Tổng cộng'} fontsize={18} fontFamily={fontFamilies.bold} />
                    <TextComponent text={'600.000 đ'} fontsize={18} fontFamily={fontFamilies.bold} />
                </RowComponent>
                <SpaceComponent height={40} />
                <ButtonComponent text={'Đặt hàng'} onPress={handleCloseBottomSheet} color={appColor.white} />
               </ContainerComponent>
            </BottomSheet>
        </ContainerComponent>
    )
}

export default CheckOrderScreen

const styles = StyleSheet.create({
    btsContainer:{
        backgroundColor: appColor.white,
        paddingHorizontal:16
    },
    activeCircleContainer: {
        borderColor: appColor.primary,
    },
    circleContainer:{
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: appColor.subText,
        backgroundColor: appColor.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeCircle: {
        backgroundColor: appColor.primary,
        borderColor: appColor.primary,
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: appColor.white,
        backgroundColor: appColor.white
    },
    btnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    imgShipper: {
        width: 85,
        height: 85,
        borderRadius: 10
    },
    viewShipper: {
        width: '100%',
        padding: 10,
        borderRadius: 15,
        backgroundColor: appColor.white
    },
    viewPrice: {
        padding: 15,
        borderRadius: 20,
        backgroundColor: appColor.white
    },
    viewPay: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: appColor.white
    },
    viewProduct: {
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        backgroundColor: appColor.white
    },
    viewAddress: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 20,
        backgroundColor: appColor.white
    },
    viewWait: {
        width: '100%',
        padding: 20,
        backgroundColor: appColor.white,
        borderRadius: 15
    },
})

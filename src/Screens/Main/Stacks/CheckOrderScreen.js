import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
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

const CheckOrderScreen = () => {
    const [order, setOrder] = useState(ORDER)
    const [status, setStatus] = useState(true)
    return (
        <ContainerComponent styles={globalStyle.container} isScroll>
            <HeaderComponent text={'Đơn hàng chi tiết'} isback />
            {status ?
                <View style={[styles.viewWait, globalStyle.shawdow]}>
                    <TextComponent text={'Đang xử lý đơn hàng của bạn'}
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
            <TextComponent text={'Chưa có shipper nào nhận đơn'}
                color={appColor.primary} fontsize={20} textAlign={'center'} fontFamily={fontFamilies.semiBold} />
            <SpaceComponent height={20} />
            <View style={[styles.viewAddress, globalStyle.shawdow]}>
                <RowComponent>
                    <Image source={require('../../../assets/images/checkOrder/shop.png')} />
                    <SpaceComponent width={15} />
                    <View>
                        <TextComponent text={'Địa chỉ nhà hàng'} fontFamily={fontFamilies.bold} />
                        <SpaceComponent height={5} />
                        <TextComponent width={280} text={'Công Viên Phần Mềm Quang Trung, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh, Việt Nam '}
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
                        <TextComponent width={280} text={'86 Đường Số 8, Phường 10, Gò Vấp, Thành phố Hồ Chí Minh '}
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
                    data={order}
                    renderItem={({ item }) => <OrderItem item={item} />}
                    keyExtractor={item => item._id}
                />
            </View>
            <SpaceComponent height={10} />
            <RowComponent justifyContent={'space-between'} styles={[styles.viewPay, globalStyle.shawdow]}>
                <TextComponent text={'Phương thức thanh toán'} fontsize={14} fontFamily={fontFamilies.bold} />
                <RowComponent >
                    <TextComponent text={'ZaloPay'} fontsize={14} fontFamily={fontFamilies.bold} />
                    <SpaceComponent width={4} />
                    <Image source={require('../../../assets/images/checkout/zalo.png')} />
                </RowComponent>
            </RowComponent>
            <SpaceComponent height={10} />
            <ButtonComponent text={'HỦY ĐƠN HÀNG'} color={appColor.white} />
            <SpaceComponent height={10} />
            <View style={[styles.viewPrice, globalStyle.shawdow]}>
                <TextComponent text={'Tóm tắt thanh toán'} fontFamily={fontFamilies.bold} />
                <SpaceComponent height={15} />
                <View style={{ paddingHorizontal: 10 }}>
                    <RowComponent justifyContent={'space-between'}>
                        <TextComponent text={'Tạm tính'} />
                        <TextComponent text={'500.000 đ'} />
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
    )
}

export default CheckOrderScreen

const styles = StyleSheet.create({
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
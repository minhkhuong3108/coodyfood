import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import RowComponent from './RowComponent'
import TextComponent from './TextComponent'
import { appColor } from '../constants/appColor'
import { fontFamilies } from '../constants/fontFamilies'
import SpaceComponent from './SpaceComponent'
import { appInfor } from '../constants/appInfor'
import { globalStyle } from '../styles/globalStyle'
import ButtonComponent from './ButtonComponent'
import { formatDistance } from './format/FormatDistance'
import formatTime from './format/FormatTime'
import { formatRating } from './format/FormatRate'
import { formatPrice } from './format/FomatPrice'
import LineComponent from './LineComponent'

const ShopAndProductComponent = ({ item, onPress, type, favorite, inCart, order, onPressAdd, onPressReduce, onPressIncrease, quantity, onPressFavorite, search, typeSearch, onPressProduct, onPressQuantity, noted, onPressNote }) => {
    const { _id, name, images, discount, rating, distance, time, soldOut, price, oldPrice, address, note } = item
    // console.log('item', item);

    return (
        type == 'shop' ?
            <TouchableOpacity onPress={onPress}>
                <View style={[typeSearch ? item.product.length > 0 ? styles.containerSearch : styles.containerSearchShop : styles.container, typeSearch ? null : globalStyle.shawdow]} >
                    {images && <Image source={{ uri: images[0] }} style={styles.img} />}
                    <View style={{ flex: 1 }}>
                        <RowComponent>
                            <TextComponent text={name} fontsize={16} styles={{ flex: 1, marginRight: 20 }}
                                ellipsizeMode={'tail'} numberOfLines={1} />
                            {favorite && <ButtonComponent type={'link'} image={require('../assets/images/favoriteProduct/heart2.png')} onPress={onPressFavorite} />}
                        </RowComponent>
                        {
                            order || favorite || search ? <TextComponent text={address} fontsize={12} color={appColor.subText}
                                styles={{ marginVertical: typeSearch > 0 ? 12 : 6, marginRight: 20 }} ellipsizeMode={'tail'} numberOfLines={2} /> :
                                <RowComponent styles={{ marginVertical: 8 }}>
                                    <Image source={require('../assets/images/home/star.png')} style={{ marginRight: 5 }} />
                                    <TextComponent
                                        text={`${formatRating(rating)} | ${distance && formatDistance(distance)} | ${time} phút`}
                                        fontsize={12} color={appColor.subText} />
                                </RowComponent>
                        }
                        {
                            order || favorite || search ?
                                <RowComponent>
                                    <TextComponent text={`Đánh giá: ${rating && formatRating(rating)}`} fontsize={12} />
                                    <SpaceComponent width={4} />
                                    <Image source={require('../assets/images/shopDetail/star.png')} />
                                </RowComponent> :
                                // <View style={styles.viewDiscount}>
                                //     <TextComponent text={`Mã giảm: ${20}%`} fontsize={12} fontFamily={fontFamilies.regular} color={appColor.primary} />
                                // </View>
                                <RowComponent>
                                    <Image source={require('../assets/images/home/location_small.png')}
                                        style={{ marginRight: 5 }} />
                                    <TextComponent text={address} fontsize={12}
                                        color={appColor.subText} ellipsizeMode={'tail'} numberOfLines={1}
                                        styles={{ paddingRight: 20 }} />
                                </RowComponent>
                        }

                    </View>
                </View>
                {typeSearch && item.product.length > 0 &&
                    <View key={item.product_id} style={{ paddingLeft: 133 }}>
                        <RowComponent button onPress={onPressProduct}>
                            <Image source={{ uri: item.product[0].image }} style={{ width: 60, height: 60, borderRadius: 8 }} />
                            <SpaceComponent width={5} />
                            <View>
                                <TextComponent text={item.product[0].name} fontsize={12} />
                                <SpaceComponent height={10} />
                                <TextComponent text={formatPrice(item.product[0].price)} fontsize={12} />
                            </View>
                        </RowComponent>
                    </View>
                }
                {
                    typeSearch &&
                    <View>
                        <SpaceComponent height={20} />
                        <LineComponent />
                        <SpaceComponent height={20} />
                    </View>
                }
            </TouchableOpacity> :
            <TouchableOpacity style={[styles.container, globalStyle.shawdow]} onPress={onPress}>
                {images && <Image source={{ uri: images[0] }} style={styles.img} />}
                <View style={{ flex: 1 }}>
                    <TextComponent text={name} numberOfLines={1} ellipsizeMode={'tail'} />
                    {noted ?
                        <RowComponent styles={{ marginTop: 8, marginBottom: 10 }} button onPress={onPressNote}>
                            <Image source={require('../assets/images/checkout/note.png')} />
                            <SpaceComponent width={8} />
                            <TextComponent text={note || 'Ghi chú'} fontsize={12} />
                        </RowComponent> :
                        <TextComponent text={`${soldOut} đã bán`} fontsize={12} color={appColor.subText} styles={{ marginTop: 8, marginBottom: 10 }} />}
                    <RowComponent justifyContent={'space-between'}>
                        <RowComponent>
                            {oldPrice &&
                                <RowComponent>
                                    <TextComponent text={`${oldPrice}đ`} fontsize={14} color={appColor.subText} styles={styles.txtOldPrice} />
                                    <SpaceComponent width={5} />
                                </RowComponent>
                            }
                            <TextComponent text={`${formatPrice(price)}`} fontsize={14} color={appColor.primary} />
                        </RowComponent>

                        {/* Test */}
                        <RowComponent>
                            {inCart ?
                                <RowComponent>
                                    <TouchableOpacity onPress={onPressReduce}>
                                        <Image source={require('../assets/images/home/reduce.png')} />
                                    </TouchableOpacity>
                                    <SpaceComponent width={5} />
                                    <TextComponent text={quantity} fontsize={14} styles={{ marginHorizontal: 10 }} onPress={onPressQuantity} />
                                    <SpaceComponent width={5} />
                                    <TouchableOpacity onPress={onPressIncrease}>
                                        <Image source={require('../assets/images/home/add.png')} />
                                    </TouchableOpacity>
                                </RowComponent> :
                                <TouchableOpacity onPress={onPressAdd}>
                                    <Image source={require('../assets/images/home/add.png')} />
                                </TouchableOpacity>
                            }
                        </RowComponent>
                    </RowComponent>
                </View>
            </TouchableOpacity>
    )
}

export default ShopAndProductComponent

const styles = StyleSheet.create({
    txtOldPrice: {
        textDecorationLine: 'line-through',
    },
    btnAdd: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColor.primary,
    },
    viewDiscount: {
        width: 100,
        // paddingHorizontal:10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: appColor.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: 113,
        height: 102,
        borderRadius: 15,
        marginRight: 20
    },
    containerSearchShop: {
        // marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20,
        backgroundColor: appColor.white,

    },
    containerSearch: {
        marginBottom: 0,
        flexDirection: 'row',
        // alignItems: 'center',
        paddingRight: 20,
        backgroundColor: appColor.white
    },
    container: {
        // flex: 1,
        borderWidth: 1,
        borderColor: appColor.gray,
        borderRadius: 15,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20,
        backgroundColor: appColor.white,
    }
})
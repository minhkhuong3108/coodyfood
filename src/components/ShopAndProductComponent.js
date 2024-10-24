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

const ShopAndProductComponent = ({ item, onPress, type, favorite, inCart, order, onPressAdd, onPressReduce, onPressIncrease, quantity }) => {
    const { _id, name, images, discount, rating, distance, time, sold, price, oldPrice, location, address } = item
    // console.log('item', item);

    return (
        type == 'shop' ?
            <TouchableOpacity style={[styles.container, globalStyle.shawdow]} onPress={onPress}>
                {images && <Image source={{ uri: images[0] }} style={styles.img} />}
                <View style={{ flex: 1 }}>
                    <RowComponent>
                        <TextComponent text={name} fontsize={16} styles={{ flex: 1 }} ellipsizeMode={'tail'} numberOfLines={1} />
                        {favorite && <ButtonComponent type={'link'} image={require('../assets/images/favoriteProduct/heart.png')} />}
                    </RowComponent>
                    {
                        order || favorite ? <TextComponent text={address} fontsize={12} color={appColor.subText}
                            styles={{ marginVertical: 6 }} /> :
                            <RowComponent styles={{ marginVertical: 8 }}>
                                <Image source={require('../assets/images/home/star.png')} style={{ marginRight: 5 }} />
                                <TextComponent
                                    text={`${rating && formatRating(rating)} | ${distance && formatDistance(distance)} | ${time && formatTime(time)}`}
                                    fontsize={12} color={appColor.subText} />
                            </RowComponent>
                    }
                    {
                        order || favorite ?
                            <RowComponent>
                                <TextComponent text={`Đánh giá: ${formatRating(rating)}`} fontsize={12} />
                                <SpaceComponent width={4} />
                                <Image source={require('../assets/images/shopDetail/star.png')} />
                            </RowComponent> :
                            <View style={styles.viewDiscount}>
                                <TextComponent text={`Mã giảm: ${20}%`} fontsize={12} fontFamily={fontFamilies.regular} color={appColor.primary} />
                            </View>
                    }
                </View>
            </TouchableOpacity> :
            <TouchableOpacity style={[styles.container, globalStyle.shawdow]} onPress={onPress}>
                {images && <Image source={{ uri: images[0] }} style={styles.img} />}
                <View style={{ flex: 1 }}>
                    <TextComponent text={name} fontsize={16} />
                    <TextComponent text={`${sold} đã bán`} fontsize={12} color={appColor.subText} styles={{ marginTop: 8, marginBottom: 10 }} />
                    <RowComponent justifyContent={'space-between'}>
                        <RowComponent>
                            {oldPrice &&
                                <RowComponent>
                                    <TextComponent text={`${oldPrice}đ`} fontsize={14} color={appColor.subText} styles={styles.txtOldPrice} />
                                    <SpaceComponent width={5} />
                                </RowComponent>
                            }
                            <TextComponent text={`${price}đ`} fontsize={14} color={appColor.primary} />
                        </RowComponent>

                        {/* Test */}
                        <RowComponent>
                            {inCart ?
                                <RowComponent>
                                    <TouchableOpacity onPress={onPressReduce}>
                                        <Image source={require('../assets/images/home/reduce.png')} />
                                    </TouchableOpacity>
                                    <SpaceComponent width={5} />
                                    <TextComponent text={quantity} fontsize={14} styles={{ marginHorizontal: 10 }} />
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
    container: {
        // flex: 1,
        borderWidth: 1,
        borderColor: appColor.gray,
        borderRadius: 15,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        backgroundColor: appColor.white,
    }
})
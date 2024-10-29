import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RowComponent from './RowComponent'
import TextComponent from './TextComponent'
import SpaceComponent from './SpaceComponent'
import { fontFamilies } from '../constants/fontFamilies'
import { appColor } from '../constants/appColor'
import { Rating } from 'react-native-ratings'
import { formatDate } from './format/FormatDate'
import { globalStyle } from '../styles/globalStyle'

const ReviewList = ({ item }) => {
    const { name, rating, comment, image, created_at } = item
    const { user } = item
    return (
        <View style={styles.containerRate}>
            {user&&<Image source={{ uri: user.image }} style={styles.imgAvatar} />}
            <View style={{ flex: 1 }}>
                <RowComponent justifyContent={'space-between'}>
                    <View>
                       {user&& <TextComponent text={user.name} fontsize={18} fontFamily={fontFamilies.bold} />}
                        <SpaceComponent height={5} />
                        <TextComponent text={formatDate(created_at)} color={appColor.subText} fontsize={12} fontFamily={fontFamilies.regular} />
                    </View>
                    {/* <Image source={require('../assets/images/productDetail/5start.png')} /> */}
                    <Rating
                        ratingCount={5}
                        imageSize={20}
                        startingValue={rating}
                        readonly={true}
                    />
                </RowComponent>
                {comment && <TextComponent text={comment} fontsize={16} styles={{ marginTop: 15 }} />}
                <SpaceComponent height={15} />
                <Image source={{ uri: image }} style={[styles.imgRate,globalStyle.shawdow]} />

            </View>
        </View>
    )
}

export default ReviewList

const styles = StyleSheet.create({
    imgRate: {
        width: 100,
        height: 100,
        backgroundColor: appColor.gray,
    },
    imgAvatar: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
    },
    containerRate: {
        flexDirection: 'row',
        marginBottom: 30
    },
})
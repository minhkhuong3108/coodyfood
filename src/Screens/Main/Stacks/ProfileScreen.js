import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import { appColor } from '../../../constants/appColor'
import SpaceComponent from '../../../components/SpaceComponent'
import { globalStyle } from '../../../styles/globalStyle'
import ProfileItem from '../../../components/ProfileItem'

const ProfileScreen = () => {
    return (
        <ContainerComponent styles={globalStyle.container}>
            <RowComponent>
                <Image style={styles.imgAvatar} source={require('../../../assets/images/profile/avatar.png')} />
                <View>
                    <TextComponent text={'Nguyễn Văn A'} fontsize={18} />
                    <SpaceComponent height={10} />
                    <TextComponent text={'0961234576'} color={appColor.subText} />
                </View>
            </RowComponent>
            <SpaceComponent height={40} />
            <ProfileItem text={'Thông tin cá nhân'} image={require('../../../assets/images/profile/user.png')} />
            <ProfileItem text={'Địa chỉ'} image={require('../../../assets/images/profile/location.png')} />
            <ProfileItem text={'Đổi mật khẩu'} image={require('../../../assets/images/profile/password.png')} />
            <ProfileItem text={'Đăng xuất'} image={require('../../../assets/images/profile/logout.png')} />
        </ContainerComponent>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({

    imgAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 40
    },
})
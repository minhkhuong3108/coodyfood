
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ContainerComponent from '../../../components/ContainerComponent';
import RowComponent from '../../../components/RowComponent';
import TextComponent from '../../../components/TextComponent';
import {appColor} from '../../../constants/appColor';
import SpaceComponent from '../../../components/SpaceComponent';
import {globalStyle} from '../../../styles/globalStyle';
import ProfileItem from '../../../components/ProfileItem';
import {useSelector,useDispatch} from 'react-redux';
import { logout } from '../../../Redux/Reducers/LoginSlice'


const ProfileScreen = ({navigation}) => {
  const {user} = useSelector(state => state.login);
  const dispatch = useDispatch()
  console.log(user);
  return (
    <ContainerComponent styles={globalStyle.container}>
      <RowComponent>
        <Image
          style={styles.imgAvatar}
          source={require('../../../assets/images/profile/avatar.png')}
        />
        <View>
          {/*Chỗ này là tên nhưng lúc đăng kí chưa có tên */}
          <TextComponent text={user.email} fontsize={18} />
          <SpaceComponent height={10} />
          {/*sđt chưa có trong reslut API */}
          <TextComponent
            text={user.phone ?? 'Chưa có thấy sđt'}
            color={appColor.subText}
          />
        </View>
      </RowComponent>
      <SpaceComponent height={40} />
      <ProfileItem
        text={'Thông tin cá nhân'}
        image={require('../../../assets/images/profile/user.png')}
        onpress={() => navigation.navigate('EditProfile')}
      />
      <ProfileItem
        text={'Địa chỉ'}
        image={require('../../../assets/images/profile/location.png')}
        onpress={() => navigation.navigate('Address')}
      />
      <ProfileItem
        text={'Đổi mật khẩu'}
        image={require('../../../assets/images/profile/password.png')}
      />
      <ProfileItem
        text={'Đăng xuất'}
        image={require('../../../assets/images/profile/logout.png')}
        onpress={()=>dispatch(logout())}
      />
    </ContainerComponent>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  imgAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 40,
  },
});

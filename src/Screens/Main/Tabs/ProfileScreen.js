
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import ContainerComponent from '../../../components/ContainerComponent';
import RowComponent from '../../../components/RowComponent';
import TextComponent from '../../../components/TextComponent';
import { appColor } from '../../../constants/appColor';
import SpaceComponent from '../../../components/SpaceComponent';
import { globalStyle } from '../../../styles/globalStyle';
import ProfileItem from '../../../components/ProfileItem';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../Redux/Reducers/LoginSlice'
import AlertChoiceModal from '../../../modal/AlertChoiceModal';
import { CallConfig, UnmountCall } from '../../Call/Callconfig';


const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.login);
  console.log('user', user);
  
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch()
  return (
    <ContainerComponent styles={globalStyle.container}>
      <RowComponent>
        <Image
          style={styles.imgAvatar}
          source={{uri:user.image}}
        />
        <View>
          {/*Chỗ này là tên nhưng lúc đăng kí chưa có tên */}
          <TextComponent text={user.name} fontsize={18} />
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
        onpress={() => navigation.navigate('ChangePassword')}
      />
      <ProfileItem
        text={'Đăng xuất'}
        image={require('../../../assets/images/profile/logout.png')}
        onpress={() => setVisible(true)}
      />
      <AlertChoiceModal visible={visible} onClose={()=>setVisible(false)}
      title={'Đăng xuất'}
      description={'Bạn có chắc muốn đăng xuất?'}
      onPress={() => {dispatch(logout()),UnmountCall()}} />
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

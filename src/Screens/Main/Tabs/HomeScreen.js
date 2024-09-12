import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ButtonComponent from '../../../components/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../Redux/Reducers/LoginSlice'
import ContainerComponent from '../../../components/ContainerComponent'
import { globalStyle } from '../../../styles/globalStyle'
import SpaceComponent from '../../../components/SpaceComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import { appColor } from '../../../constants/appColor'
import SearchComponent from '../../../components/SearchComponent'
import { fontFamilies } from '../../../constants/fontFamilies'
import Swiper from 'react-native-swiper'

const HomeScreen = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.login)
  const [search, setSearch] = useState('')
  const [cate, setCate] = useState(CATE)
  console.log('user', user);

  const groupedData = [];
  for (let i = 0; i < cate.length; i += 2) {
    groupedData.push(cate.slice(i, i + 2));
  }

  const renderGroupedItem = ({ item ,index}) => (
    <View key={index} style={styles.groupedItem}>
      {item.map((subItem) => (
        <View key={subItem.id} style={styles.item}>
          {renderCate({ item: subItem })}
        </View>
      ))}
    </View>
  );

  const renderCate = ({ item }) => {
    const { id, name, image } = item
    return (
      <TouchableOpacity key={id} style={styles.btnCate}>
        <View style={styles.viewImgCate}>
          <Image source={image} />
        </View>
        <TextComponent text={name} fontsize={14} styles={{width:63}} textAlign={'center'}/>
      </TouchableOpacity>
    )
  }

  const renderFeature = ({ item }) => {

  }

  const signOut = () => {
    dispatch(logout())
  }
  return (
    <ContainerComponent styles={globalStyle.container} isScroll>
      <SpaceComponent height={50} />
      <RowComponent justifyContent={'space-between'}>
        <View>
          <TextComponent text={'Giao đến'} fontsize={16} fontFamily={fontFamilies.bold} />
          <SpaceComponent height={15} />
          <RowComponent>
            <Image source={require('../../../assets/images/home/location.png')} style={{ marginRight: 10 }} />
            <TextComponent text={'Ahmedabad,Gujarat'} color={appColor.subText} />
          </RowComponent>
        </View>
        <Image source={require('../../../assets/images/home/avatar.png')} style={styles.imgAvatar} />
      </RowComponent>
      <SpaceComponent height={25} />
      <SearchComponent placeholder={'Tìm kiếm'} value={search} onchangeText={text => setSearch(text)} />
      <SpaceComponent height={20} />

      <Swiper
        dotColor={appColor.white}
        activeDotColor={appColor.primary}
        height={'auto'}
        autoplay
      >
        <Image source={require('../../../assets/images/home/s1.png')} style={styles.banner} />
        <Image source={require('../../../assets/images/home/s2.png')} style={styles.banner} />
        <Image source={require('../../../assets/images/home/s3.png')} style={styles.banner} />
        <Image source={require('../../../assets/images/home/s4.png')} style={styles.banner} />
      </Swiper>
      <SpaceComponent height={10} />
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={groupedData}
          renderItem={renderGroupedItem}
          keyExtractor={(item,index) => index.toString()}
        />
      </View>
      <SpaceComponent height={20} />
      <TextComponent text={'Nổi bật gần bạn'}/>
      <View>
        
      </View>

    </ContainerComponent>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  // groupedItem: {
  //   flexDirection: 'column',
  //   justifyContent: 'space-between',
  // },
  item: {
    marginVertical: 15,
  },
  viewImgCate: {
    width: 63,
    height: 63,
    backgroundColor: appColor.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: 'rgba(0,0,0,0.1)',
    elevation: 5,
    marginBottom: 10,
    borderRadius: 8
  },
  btnCate: {
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  banner: {
    width: '100%',
    resizeMode: 'contain',

  },
  imgAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
})

var CATE = [
  {
    id: 1,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png')
  },
  {
    id: 2,
    name: 'a',
    image: require('../../../assets/images/home/piza.png')
  },
  {
    id: 3,
    name: 'b',
    image: require('../../../assets/images/home/piza.png')
  },
  {
    id: 4,
    name: 'c',
    image: require('../../../assets/images/home/piza.png')
  },
  {
    id: 5,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png')
  },
  {
    id: 6,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png')
  },
  {
    id: 7,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png')
  },
  {
    id: 8,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png')
  },
  {
    id: 9,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png')
  },
  {
    id: 10,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png')
  },
]
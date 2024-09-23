import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import { globalStyle } from '../../../styles/globalStyle'
import HeaderComponent from '../../../components/HeaderComponent'
import SearchComponent from '../../../components/SearchComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import LineComponent from '../../../components/LineComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import { appColor } from '../../../constants/appColor'
import ButtonComponent from '../../../components/ButtonComponent'
import AddressItem from '../../../components/AddressItem'

const AddressScreen = () => {
    const [search, setSearch] = useState('')
    const [address, setAddress] = useState(ADDRESS)
    return (
        <ContainerComponent styles={globalStyle.container} isScroll>
            <HeaderComponent text={'Địa chỉ'} isback />
            <SearchComponent placeholder={'Tìm kiếm'} value={search} onchangeText={text => setSearch(text)} />
            <SpaceComponent height={10} />
            <LineComponent />
            <SpaceComponent height={10} />
            <RowComponent>
                <Image source={require('../../../assets/images/address/location.png')} />
                <SpaceComponent width={8} />
                <TextComponent text={'Địa chỉ hiện tại'} fontsize={20} />
            </RowComponent>
            <SpaceComponent height={20} />
            <AddressItem title={'Nhà'}
             address={'Công Viên Phần Mềm Quang Trung, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh, Việt Nam'} 
             name={'Nguyễn Văn A'} phone={'0123456789'} />
            <SpaceComponent height={10} />
            <LineComponent />
            <SpaceComponent height={10} />
            <RowComponent>
                <Image source={require('../../../assets/images/address/save.png')} />
                <SpaceComponent width={8} />
                <TextComponent text={'Địa chỉ đã lưu'} fontsize={20} />
            </RowComponent>
            <SpaceComponent height={20} />
            {/* <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            data={address}
            renderItem={({item}) => 
            <AddressItem title={item.title} address={item.address} name={item.name} phone={item.phone} edit />}
            keyExtractor={item => item.id}
            /> */}
            {address.map((item,index) => (
                <AddressItem key={index} title={item.title} address={item.address} name={item.name} phone={item.phone} save />
            ))}
            <SpaceComponent height={20} />
            <ButtonComponent text={'Thêm địa chỉ mới'} color={appColor.white}  />
            <SpaceComponent height={70} />
        </ContainerComponent>
    )
}

export default AddressScreen

const styles = StyleSheet.create({
    
})
var ADDRESS=[
    {
        id:1,
        title:'Công ty',
        address:'Công Viên Phần Mềm Quang Trung, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh, Việt Nam',
        name:'Nguyễn Văn A',
        phone:'0123456789'
    },
    {
        id:2,
        title:'Nhà',
        address:'Công Viên Phần Mềm Quang Trung, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh, Việt Nam',
        name:'Nguyễn Văn A',
        phone:'0123456789'
    },
    {
        id:3,
        title:'Nhà',
        address:'Công Viên Phần Mềm Quang Trung, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh, Việt Nam',
        name:'Nguyễn Văn A',
        phone:'0123456789'
    }
]
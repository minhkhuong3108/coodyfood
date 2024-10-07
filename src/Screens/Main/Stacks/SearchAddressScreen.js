import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import SearchComponent from '../../../components/SearchComponent'
import MapAPI from '../../../core/apiMap/MapAPI'
import SpaceComponent from '../../../components/SpaceComponent'
import TextComponent from '../../../components/TextComponent'
import { globalStyle } from '../../../styles/globalStyle'
import LineComponent from '../../../components/LineComponent'

const SearchAddressScreen = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [description, setDescription] = useState([]);
    const [isShowLocation, setIsShowLocation] = useState(true);
    console.log('description', description);


    const refSearch = useRef()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (refSearch.current) {
                refSearch.current.focus();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [])

    const getPlacesAutocomplete = async () => {
        let autoComplete = await MapAPI.getPlacesAutocomplete({
            search: encodeURIComponent(search),
        });
        setDescription(autoComplete.predictions);
    };

    const updateSearch = (text) => {
        setSearch(text);
        setIsShowLocation(true)
    };
    useEffect(() => {
        if (search.length >= 1) {
            getPlacesAutocomplete();
        }
    }, [search]);

    const renderItem = ({ item }) => {
        console.log('item', item);

        return (
            <TouchableOpacity style={{ paddingTop: 10 }} onPress={() => navigation.navigate('AddAddress', { item: item.description })}>
                <TextComponent text={item.description} />
                <SpaceComponent height={10} />
                <LineComponent />
            </TouchableOpacity>
        )
    }
    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent text={'Tìm kiếm địa chỉ'} isback />
            <View style={{ height: 50 }}>
                <SearchComponent placeholder={'Tìm kiếm địa chỉ'} value={search} onchangeText={updateSearch} ref={refSearch} />
            </View>
            <SpaceComponent height={20} />
            {isShowLocation &&
                <FlatList
                    data={description}
                    renderItem={renderItem}
                />
            }
        </ContainerComponent>
    )
}

export default SearchAddressScreen

const styles = StyleSheet.create({})
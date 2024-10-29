import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import { globalStyle } from '../../../styles/globalStyle'
import { useSelector } from 'react-redux'
import ShopAndProductComponent from '../../../components/ShopAndProductComponent'

const FavoriteScreen = () => {
    const { user } = useSelector(state => state.login)
    const [data, setData] = useState([])

    const getFavorite = async () => {
        try {
            const response = await AxiosInstance().get(`/favorites/${user._id}`)
            console.log('response', response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent text={'Yêu thích'} />
            <FlatList
                data={data}
                renderItem={({ item }) => <ShopAndProductComponent item={item} favorite />}
                keyExtractor={item => item._id}
            />
        </ContainerComponent>
    )
}

export default FavoriteScreen

const styles = StyleSheet.create({})
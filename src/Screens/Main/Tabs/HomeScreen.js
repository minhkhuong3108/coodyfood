import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ButtonComponent from '../../../components/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../Redux/Reducers/LoginSlice'

const HomeScreen = () => {
  const dispatch = useDispatch()
  const{user} = useSelector(state => state.login)
  console.log('user', user);
  
  const signOut = () => {
    dispatch(logout())
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ButtonComponent text={'Logout'} onPress={signOut} />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})
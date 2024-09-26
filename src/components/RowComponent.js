import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const RowComponent = ({ children, styles, justifyContent, button, activeOpacity,onPress }) => {
  return (
    button ? <TouchableOpacity onPress={onPress} activeOpacity={activeOpacity} 
    style={[styless.container, { justifyContent: justifyContent }, styles]}>
      {children}
    </TouchableOpacity> :
      <View style={[styless.container, { justifyContent: justifyContent }, styles]}>
        {children}
      </View>

  )
}

export default RowComponent

const styless = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

})
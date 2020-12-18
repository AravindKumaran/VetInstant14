import React from 'react'

import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const AppButton = ({ title, onPress, btnStyle, txtStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, btnStyle]} onPress={onPress}>
      <Text style={[styles.text, txtStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fc5c65',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
})

export default AppButton

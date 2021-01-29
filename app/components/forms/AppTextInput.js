import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const AppTextInput = ({ icon, numberOfLines = 1, width, ...rest }) => {
  return (
    <View style={[styles.container]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color='#6e6969'
          style={styles.icon}
        />
      )}
      <TextInput
        style={styles.textInput}
        numberOfLines={numberOfLines}
        {...rest}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    marginRight: 5,
    overflow: 'hidden',
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    fontSize: 18,
    color: '#0c0c0c',
    flex: 1,
    textAlignVertical: 'top',
    width: '100%',
  },
})

export default AppTextInput

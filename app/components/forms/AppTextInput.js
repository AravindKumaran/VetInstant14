import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const AppTextInput = ({ icon, numberOfLines = 1, width, value, ...rest }) => {
  return (
    <View style={[styles.container]}>
      {/* {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color='#6e6969'
          style={styles.icon}
        />
      )} */}
      <TextInput
        style={styles.textInput}
        numberOfLines={numberOfLines}
        value={value}
        {...rest}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFFFFF',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    marginVertical: 10,
    marginRight: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(21, 56, 95, 0.3)'
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    fontSize: 12,
    color: '#47687F',
    flex: 1,
    textAlignVertical: 'center',
    width: '100%',
  },
})

export default AppTextInput

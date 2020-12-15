import React from 'react'
import { useFormikContext } from 'formik'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import RNPickerSelect from 'react-native-picker-select'

import ErrorMessage from './ErrorMessage'
import AppText from '../AppText'

import { StyleSheet } from 'react-native'

const AppFormPicker = ({ label, items, name, placeholder }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext()

  return (
    <>
      <AppText>{label}</AppText>
      <RNPickerSelect
        useNativeAndroidPickerStyle={false}
        onValueChange={(value) => setFieldValue(name, value)}
        style={pickerSelectStyles}
        items={items}
        value={values[name]}
        Icon={() => (
          <MaterialCommunityIcons name='chevron-down' size={24} color='#000' />
        )}
      />

      <ErrorMessage error={errors[name]} visible={!values[name]} />
    </>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#fff',
    fontSize: 18,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    color: '#0c0c0c',
    flex: 1,
    overflow: 'scroll',
    paddingRight: 30,
  },
  inputAndroid: {
    backgroundColor: '#fff',
    fontSize: 18,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    color: '#0c0c0c',
    flex: 1,
    overflow: 'scroll',
    paddingRight: 30,
  },
  iconContainer: {
    top: 30,
    right: 12,
  },
})
export default AppFormPicker

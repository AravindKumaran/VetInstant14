import React from 'react'

import { useFormikContext } from 'formik'

import { StyleSheet, View, Text } from 'react-native'
import ErrorMessage from './ErrorMessage'
import ImageInputList from './ImageInputList'

const AppImageListPicker = ({ name }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext()

  const handleAdd = (uri) => {
    console.log('Uri', ...values[name])
    // setFieldValue(name, [...values[name], uri])
    setFieldValue(name, [...values[name], uri])
  }

  const handleRemove = (uri) => {
    console.log('Uri', ...values[name])
    setFieldValue(
      name,
      values[name].filter((imageUri) => imageUri !== uri)
    )
  }

  return (
    <View>
      <ImageInputList
        imageUris={values[name]}
        onAddImage={handleAdd}
        onRemoveImage={handleRemove}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  )
}

const styles = StyleSheet.create({})

export default AppImageListPicker

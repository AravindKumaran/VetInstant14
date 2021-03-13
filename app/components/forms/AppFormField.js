import React from 'react'
import { useFormikContext } from 'formik'
import { StyleSheet, View } from 'react-native'

import AppTextInput from './AppTextInput'
import ErrorMessage from './ErrorMessage'
import AppText from '../AppText'

const AppFormField = ({ name, label, numberOfLines, contStyle, ...rest }) => {
  const {
    setFieldTouched,
    handleChange,
    errors,
    touched,
    values,
  } = useFormikContext()
  return (
    <View style={[styles.container, contStyle]}>
      {label && <AppText>{label}</AppText>}
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        numberOfLines={numberOfLines}
        value={values[name]}
        {...rest}
      />

      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
})

export default AppFormField

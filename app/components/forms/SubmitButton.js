import React from 'react'
import { useFormikContext } from 'formik'

import AppButton from '../AppButton'

const SubmitButton = ({ title, ...rest }) => {
  const { handleSubmit } = useFormikContext()
  return <AppButton title={title} onPress={handleSubmit} {...rest} />
}

export default SubmitButton

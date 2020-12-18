import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AppFormField from '../components/forms/AppFormField'

import FormImagePicker from '../components/forms/FormImagePicker'

const validationSchema = Yup.object().shape({
  problems: Yup.string().max(100).required().label('Problems'),
  photo: Yup.string().nullable(),
})

const CallVetScreen = () => {
  const handleSubmit = (values) => {
    console.log(values)
  }

  return (
    <View style={styles.container}>
      <AppText
        style={{ textAlign: 'center', fontSize: 20, marginVertical: 30 }}
      >
        Please Provide the problems of your pet below
      </AppText>
      <Formik
        initialValues={{
          problems: '',
          photo: null,
          videoCall: true,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, setFieldValue }) => (
          <>
            <AppFormField
              label='Pet Problems'
              autoCapitalize='none'
              autoCorrect={false}
              name='problems'
              numberOfLines={3}
              placeholder='enter your pet problems'
            />

            <AppText style={{ marginVertical: 20 }}>
              Select Image(optional)
            </AppText>
            <FormImagePicker name='photo' />

            <View style={styles.btnContainer}>
              <AppButton
                title='Video Call'
                btnStyle={{ width: '50%', marginRight: 10 }}
                txtStyle={{ textAlign: 'center' }}
                onPress={(e) => {
                  setFieldValue('videoCall', true)
                  handleSubmit(e)
                }}
              />
              <AppButton
                title=' Start Chat'
                btnStyle={{ width: '50%', marginRight: 5 }}
                onPress={(e) => {
                  setFieldValue('videoCall', false)
                  handleSubmit(e)
                }}
              />
            </View>
          </>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 30,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    // marginHorizontal: 20,
    alignItems: 'flex-end',
  },
})

export default CallVetScreen

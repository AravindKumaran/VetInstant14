import React, { useState, useContext } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AppFormField from '../components/forms/AppFormField'
import FormImagePicker from '../components/forms/FormImagePicker'

import petsApi from '../api/pets'
import doctorsApi from '../api/doctors'
import ErrorMessage from '../components/forms/ErrorMessage'
import LoadingIndicator from '../components/LoadingIndicator'
import AuthContext from '../context/authContext'

const validationSchema = Yup.object().shape({
  problems: Yup.string().max(100).required().label('Problems'),
  photo: Yup.string().nullable(),
})

const CallVetScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext)
  console.log(user)
  console.log('Route', route)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const handleSubmit = async (values) => {
    if (values.videoCall) {
      navigation.navigate('VideoCall')
      return
    } else if (!values.videoCall) {
      navigation.navigate('Chat', { doc: route?.params?.doc })
      return
    }

    // const patientData = {
    //   name: user.name,
    //   problem: values.problems,
    //   petname: route?.params?.pet.name,
    // }

    // const form = new FormData()
    // if (values.photo) {
    //   form.append('photo', {
    //     name: 'photo',
    //     type: 'image/jpeg',
    //     uri: values.photo,
    //   })
    // }

    // form.append('docname', route?.params?.doc.user.name)
    // form.append('problem', values.problems)
    // setLoading(true)
    // const res = await petsApi.savePetProblems(form, route?.params?.pet._id)

    // if (!res.ok) {
    //   setError(res.data?.msg)
    //   setLoading(false)
    //   // console.log(res)
    //   return
    // }

    // const docRes = await doctorsApi.savePatientDetails(
    //   patientData,
    //   route?.params?.doc._id
    // )

    // if (!docRes.ok) {
    //   setLoading(false)
    //   console.log(res)
    //   return
    // }

    // setError(null)
    // console.log('Pet Res', res.data)
    // console.log('Doc', docRes.data)
    // setLoading(false)
  }

  return (
    <ScrollView>
      <LoadingIndicator visible={loading} />
      <AppButton
        title='Pet History'
        btnStyle={{ marginLeft: 30, marginTop: 30, width: '80%' }}
        onPress={() =>
          navigation.navigate('PetProblems', { id: route?.params?.pet._id })
        }
      />
      <View style={styles.container}>
        <AppText
          style={{ textAlign: 'center', fontSize: 20, marginVertical: 20 }}
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
              {error && <ErrorMessage visible={!loading} error={error} />}

              <View style={styles.btnContainer}>
                <AppButton
                  title='Call'
                  iconName='video'
                  btnStyle={{ width: '50%', marginRight: 10 }}
                  txtStyle={{ textAlign: 'center' }}
                  onPress={(e) => {
                    setFieldValue('videoCall', true)
                    handleSubmit(e)
                  }}
                />
                <AppButton
                  title='Chat'
                  iconName='message-circle'
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
    </ScrollView>
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
    marginTop: 30,
    alignItems: 'flex-end',
  },
})

export default CallVetScreen

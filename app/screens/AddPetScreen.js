import React, { useState, useRef } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet, View } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import petsApi from '../api/pets'
import AppFormField from '../components/forms/AppFormField'
import SubmitButton from '../components/forms/SubmitButton'
import ErrorMessage from '../components/forms/ErrorMessage'
import LoadingIndicator from '../components/LoadingIndicator'

import AppFormPicker from '../components/forms/AppFormPicker'
import AppImagePicker from '../components/forms/AppImagePicker'
import AppImageListPicker from '../components/forms/AppImageListPicker'
import AppText from '../components/AppText'

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  breed: Yup.string().required().label('Breed'),
  years: Yup.number().required('*Required').min(0),
  months: Yup.number()
    .test('samefield', '*Required', function (value) {
      if (value < 0 || value > 11) return false
      return true
    })
    .required('*Required')
    .min(0),
  weight: Yup.number().required().min(1).label('Weight'),
  gender: Yup.string().required('Please pick pet gender').nullable(),
  type: Yup.string().required('Please pick a species').nullable(),
  photo: Yup.string().required('Please select your pet image').nullable(),
  images: Yup.array().label('Images'),
})

const petTypes = [
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
]

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

const AddPetScreen = ({ navigation }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    const form = new FormData()
    form.append('photo', {
      name: 'photo',
      type: 'image/jpeg',
      uri: values.photo,
    })

    if (values.images) {
      values.images.forEach((image, index) => {
        form.append('images', {
          name: 'image' + index,
          type: 'image/jpeg',
          uri: image,
        })
      })
    }
    form.append('name', values.name)
    form.append('years', values.years)
    form.append('months', values.months)
    form.append('breed', values.breed)
    form.append('gender', values.gender)
    form.append('type', values.type)
    form.append('weight', values.weight)
    setLoading(true)
    const res = await petsApi.savePet(form)
    if (!res.ok) {
      setLoading(false)
      setError(res.data.msg)
      console.log(res)
      return
    }

    setError(null)
    navigation.navigate('Home', { pet: values })
    setLoading(false)
  }
  return (
    <>
      <LoadingIndicator visible={loading} />
      <ScrollView vertical={true}>
        <View style={styles.container}>
          {error && <ErrorMessage error={error} visible={!loading} />}

          <Formik
            initialValues={{
              name: '',
              breed: '',
              years: '',
              months: '',
              weight: '',
              photo: null,
              gender: null,
              type: null,
              images: [],
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <>
                <AppImagePicker name='photo' />
                <AppFormPicker items={petTypes} label='Species' name='type' />

                <AppFormField
                  label='Name'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='name'
                  placeholder='Enter your pet name'
                />
                <AppFormField
                  label='Breed'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='breed'
                  placeholder='Enter your pet breed'
                />
                <AppFormPicker items={genders} label='Gender' name='gender' />

                <AppText>Age</AppText>

                <View style={styles.wrapper}>
                  <AppFormField
                    autoCapitalize='none'
                    autoCorrect={false}
                    name='years'
                    keyboardType='numeric'
                    placeholder='Years'
                    maxLength={3}
                  />

                  <AppFormField
                    autoCapitalize='none'
                    autoCorrect={false}
                    name='months'
                    keyboardType='numeric'
                    placeholder='Months'
                    maxLength={2}
                  />
                </View>

                <AppFormField
                  label='Weight'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='weight'
                  keyboardType='numeric'
                  placeholder='Enter your pet weight in kgs'
                  maxLength={5}
                />
                <AppText style={{ marginVertical: 20 }}>
                  Pet History (Optional)
                </AppText>
                <AppImageListPicker name='images' />

                <SubmitButton title='Save Pet' />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 20,
  },
  wrapper: {
    flexDirection: 'row',
    width: '50%',
  },
})

export default AddPetScreen

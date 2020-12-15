import React, { useEffect, useState, useContext } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet, View } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import SubmitButton from '../components/forms/SubmitButton'
import ErrorMessage from '../components/forms/ErrorMessage'
import LoadingIndicator from '../components/LoadingIndicator'
import AppFormPicker from '../components/forms/AppFormPicker'
import AppText from '../components/AppText'
import AuthContext from '../context/authContext'

import hospitalsApi from '../api/hospitals'
import usersApi from '../api/users'

const validationSchema = Yup.object().shape({
  hospname: Yup.string().nullable().required('Please select a hospital'),
  docname: Yup.string().nullable().required('Please select a doctor'),
})

const SaveVetScreen = ({ navigation, route }) => {
  const initialValues = {
    hospname: route.params?.hosp._id || null,
    docname: route.params?.doc._id || null,
  }
  const { setUser } = useContext(AuthContext)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hospitals, setHospitals] = useState([])
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    if (route.params?.hosp._id) {
      getAllDoctors(route.params?.hosp._id)
    }
  }, [])

  const getAllHospitals = async () => {
    setLoading(true)
    const res = await hospitalsApi.getHospitals()
    if (!res.ok) {
      setLoading(false)
      console.log(res)
      return
    }
    let allHospitals = res.data.hospitals
    let newHospitals = allHospitals.reduce((acc, item) => {
      acc.push({
        label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        value: item._id,
      })
      return acc
    }, [])
    setHospitals(newHospitals)
    setLoading(false)
  }

  const getAllDoctors = async (hospitalId) => {
    setLoading(true)
    const res = await hospitalsApi.getHospitalsDoctors(hospitalId)
    if (!res.ok) {
      setLoading(false)
      console.log(res)
      return
    }
    let allDoctors = res.data.doctors
    let newDoctors = allDoctors.reduce((acc, item) => {
      acc.push({
        label: item.user.name.charAt(0).toUpperCase() + item.user.name.slice(1),
        value: item._id,
      })
      return acc
    }, [])
    setDoctors(newDoctors)
    setLoading(false)
  }

  const handleSubmit = async ({ docname, hospname }) => {
    if (!docname) {
      getAllDoctors(hospname)
      return
    }

    setLoading(true)
    const res = await usersApi.saveVet(hospname, docname)
    if (!res.ok) {
      console.log(res)
      return
    }

    setUser(res.data.user)
    setLoading(false)
    navigation.navigate('MyVet')
  }

  return (
    <>
      <LoadingIndicator visible={loading} />
      <ScrollView vertical={true}>
        <View style={styles.container}>
          <AppText
            style={{ fontSize: 22, textAlign: 'center', marginVertical: 30 }}
          >
            {route.params?.title || 'Select Vet Details'}
          </AppText>
          {error && <ErrorMessage error={error} visible={!loading} />}

          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ values }) => {
              console.log('Hr', values)
              useEffect(() => {
                getAllHospitals()
                if (values.hospname) {
                  getAllDoctors(values.hospname)
                }
              }, [values.hospname])
              return (
                <>
                  <AppFormPicker
                    items={hospitals}
                    label='Select Hospital Name'
                    name='hospname'
                  />
                  {doctors.length > 0 && (
                    <AppFormPicker
                      items={doctors}
                      label='Select Doctor'
                      name='docname'
                    />
                  )}

                  <SubmitButton title='Submit' />
                </>
              )
            }}
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
})

export default SaveVetScreen

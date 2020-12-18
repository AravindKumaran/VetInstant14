import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import doctorsApi from '../api/doctors'
import AppText from '../components/AppText'
import LoadingIndicator from '../components/LoadingIndicator'
import AuthContext from '../context/authContext'

const OnlineVetScreen = () => {
  const { user } = useContext(AuthContext)

  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)

  const getOnlineAvailableDoctors = async () => {
    setLoading(true)
    const res = await doctorsApi.getOnlineDoctors()
    if (!res.ok) {
      console.log(res)
      setLoading(false)
      return
    }
    const dc = res.data.doctors.filter(
      (doc) => doc.user?.isOnline && doc._id !== user.doctorId
    )
    setDoctors(dc)
    setLoading(false)
  }

  useEffect(() => {
    getOnlineAvailableDoctors()
  }, [])

  return (
    <>
      {loading ? (
        <LoadingIndicator visible={loading} />
      ) : (
        <View style={styles.container}>
          {doctors.length > 0 ? (
            <>
              <AppText style={{ textAlign: 'center', fontSize: 22 }}>
                Choose From Available Online Vets
              </AppText>
              {doctors.map((doc) => (
                <AppText key={doc._id} style={styles.text}>
                  {doc.user.name}
                </AppText>
              ))}
            </>
          ) : (
            <AppText
              style={{ textAlign: 'center', fontSize: 22, marginTop: 100 }}
            >
              No Vet is Available right now! Please try again after few minutes!
            </AppText>
          )}
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 30,
    marginHorizontal: 20,
  },
  text: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
})

export default OnlineVetScreen

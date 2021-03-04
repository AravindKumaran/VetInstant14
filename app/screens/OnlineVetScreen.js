import React, { useState, useEffect, useContext } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import doctorsApi from '../api/doctors'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import LoadingIndicator from '../components/LoadingIndicator'
import AuthContext from '../context/authContext'

const OnlineVetScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [doctors, setDoctors] = useState([])
  const [value, setValue] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getOnlineAvailableDoctors = async () => {
      setLoading(true)
      const res = await doctorsApi.getOnlineDoctors()
      if (!res.ok) {
        console.log(res)
        setLoading(false)
        return
      }
      const dc = res.data.doctors.filter(
        (doc) => doc.user?.isOnline === true && doc.user._id !== user.doctorId
      )
      setDoctors(dc)
      setLoading(false)
    }
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
              <ScrollView style={styles.wrapper}>
                {doctors.map((doc) => (
                  <TouchableOpacity
                    key={doc._id}
                    onPress={() => setValue(doc)}
                    style={[
                      styles.card,
                      value?.user.name === doc.user.name ? styles.active : '',
                    ]}
                  >
                    <AppText style={styles.text}>{doc.user.name}</AppText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {value && (
                <AppButton
                  title='Continue'
                  onPress={() =>
                    navigation.navigate('CallVet', {
                      doc: value,
                    })
                  }
                />
              )}
            </>
          ) : (
            <AppText
              style={{ textAlign: 'center', fontSize: 22, marginTop: 100 }}
            >
              No Vet is Available Right Now. Please Try Again After Few Minutes.
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
    fontSize: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5ffe5',
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginVertical: 20,
  },
  active: {
    borderColor: 'blue',
  },
  wrapper: {
    width: '100%',
    marginHorizontal: 15,
    height: 10,
  },
})

export default OnlineVetScreen

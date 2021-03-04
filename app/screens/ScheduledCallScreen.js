import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Feather } from '@expo/vector-icons'

import AppText from '../components/AppText'
import LoadingIndicator from '../components/LoadingIndicator'

import scheduledCallsApi from '../api/scheduledCall'

const ScheduledCallScreen = () => {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getAllScheduledCalls = async () => {
      setLoading(true)
      const res = await scheduledCallsApi.getScheduledCall()
      if (!res.ok) {
        setLoading(false)
        console.log('Error', res)
        return
      }

      setCalls(res.data.scheduledCalls)
      setLoading(false)
    }

    getAllScheduledCalls()
  }, [])

  return (
    <ScrollView>
      <LoadingIndicator visible={loading} />
      <View style={styles.container}>
        {calls.length > 0 ? (
          calls.map((call) => (
            <View style={styles.card} key={call._id}>
              <AppText
                style={{
                  textTransform: 'capitalize',
                  fontSize: 20,
                  color: '#344247',
                }}
              >
                Doctor Name:
                {call.doctorName}
              </AppText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Feather
                    style={{ marginLeft: 15 }}
                    name='calendar'
                    size={22}
                    color='#D1D5da'
                  />
                  <AppText>{new Date(call.date).toLocaleDateString()}</AppText>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Feather
                    style={{ marginLeft: 15 }}
                    name='clock'
                    size={22}
                    color='#D1D5da'
                  />
                  <AppText>{new Date(call.date).toLocaleTimeString()}</AppText>
                </View>
              </View>
            </View>
          ))
        ) : (
          <AppText style={{ textAlign: 'center', fontSize: 25 }}>
          No Calls Scheduled
          </AppText>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
})

export default ScheduledCallScreen

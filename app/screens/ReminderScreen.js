import React, { useState, useEffect } from 'react'

import { StyleSheet, ScrollView, View } from 'react-native'
import AppButton from '../components/AppButton'
import AppText from '../components/AppText'
import { Feather } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'

import {
  getObjectData,
  getAllKeys,
  clearAll,
  removeValue,
} from '../components/utils/reminderStorage'

const ReminderScreen = ({ navigation }) => {
  const [todayReminders, setTodayReminders] = useState([])
  const [upcomingReminders, setUpcomingReminders] = useState([])

  const getReminders = async () => {
    const data = await getAllKeys()
    // console.log(data)

    if (data.length > 0) {
      data.forEach(async (dateTime) => {
        console.log('Dateime', dateTime)
        const date = dateTime.split('-')[0]
        if (date === new Date().toLocaleDateString()) {
          const rmr = await getObjectData(dateTime)
          todayReminders.push(rmr)
        } else {
          const rmr = await getObjectData(dateTime)
          upcomingReminders.push(rmr)
        }

        setTodayReminders([...Array.from(new Set(todayReminders))])
        setUpcomingReminders([...new Set(upcomingReminders)])
      })
    }
  }

  useEffect(() => {
    getReminders()
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* {todayReminders.length === 0 && upcomingReminders.length === 0 && (
          <AppText>There's no reminders found!</AppText>
        )} */}
        <AppButton
          title='New Reminder'
          onPress={() =>
            navigation.navigate('AddReminder', {
              rmr: todayReminders,
            })
          }
        />

        {todayReminders.length > 0 && (
          <>
            <AppText>Today's Reminders</AppText>
            {todayReminders.map((rmr, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.innerCard}>
                  <AppText style={{ flex: 1 }}>{rmr.reminder}</AppText>
                  <Feather
                    name='trash-2'
                    size={22}
                    color='#6e6969'
                    style={styles.icon}
                    onPress={async () => {
                      await Notifications.cancelScheduledNotificationAsync(
                        rmr.identifier
                      )
                      const d = new Date(rmr.date)

                      await removeValue(
                        `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`
                      )
                      todayReminders.splice(index, 1)
                      setTodayReminders([...todayReminders])
                    }}
                  />
                </View>
              </View>
            ))}
          </>
        )}

        {upcomingReminders.length > 0 && (
          <>
            <AppText>Upcoming Reminders</AppText>
            {upcomingReminders.map((rmr, index) => (
              <View key={index} style={styles.card}>
                <AppText style={{ fontSize: 15 }}>
                  {rmr.endDate
                    ? rmr.endDate.split('T')[0]
                    : rmr.date.split('T')[0]}
                </AppText>
                <View style={styles.innerCard}>
                  <AppText style={{ flex: 1 }}>{rmr.reminder}</AppText>
                  <Feather
                    name='trash-2'
                    size={22}
                    color='#6e6969'
                    style={styles.icon}
                    onPress={async () => {
                      await Notifications.cancelScheduledNotificationAsync(
                        rmr.identifier
                      )
                      const d = new Date(rmr.date)

                      await removeValue(
                        `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`
                      )
                      upcomingReminders.splice(index, 1)
                      setUpcomingReminders([...upcomingReminders])
                    }}
                  />
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    marginVertical: 30,
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
  },
  innerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default ReminderScreen

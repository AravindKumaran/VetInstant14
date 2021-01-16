import React, { useContext, useState, useEffect } from 'react'
import { ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'

import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AuthContext from '../context/authContext'
import authStorage from '../components/utils/authStorage'
import AddPetButton from '../components/AddPetButton'
import LoadingIndicator from '../components/LoadingIndicator'

import * as Notifications from 'expo-notifications'
import petsApi from '../api/pets'

import {
  getAllKeys,
  getObjectData,
  removeValue,
} from '../components/utils/reminderStorage'

const HomeScreen = ({ navigation, route }) => {
  const { user, setUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [pets, setPets] = useState([])
  const [rmr, setRmr] = useState([])
  const [todayReminders, setTodayReminders] = useState([])
  const [upcomingReminders, setUpcomingReminders] = useState([])

  const isFocused = useIsFocused()

  const getAllPets = async () => {
    setLoading(true)
    const res = await petsApi.getPets()
    if (!res.ok) {
      setLoading(false)
      console.log(res)
    }
    setLoading(false)
    setPets(res.data.pets)
  }

  useEffect(() => {
    getAllPets()
  }, [])

  useEffect(() => {
    const getAllRmr = async () => {
      const data = await getAllKeys()
      // console.log(data)
      setRmr(data)
    }

    getAllRmr()
  }, [isFocused])

  useEffect(() => {
    const removePreviousAndGetReminders = async () => {
      if (rmr.length > 0) {
        const tr = []
        const upr = []
        rmr.forEach(async (dateTime) => {
          const date = dateTime.split('-')[0]
          const prevDate = new Date(date).getDate()
          const today = new Date().getDate()
          const rmr = await getObjectData(dateTime)
          if (
            prevDate < today ||
            (today === 1 && prevDate === 31) ||
            (today === 1 && prevDate === 30)
          ) {
            await Notifications.cancelScheduledNotificationAsync(rmr.identifier)
            await removeValue(dateTime)
          } else if (date === new Date().toLocaleDateString()) {
            tr.push(rmr)
          } else {
            upr.push(rmr)
          }
          setTodayReminders(tr)
          setUpcomingReminders(upr)
        })
      }
    }
    removePreviousAndGetReminders()
  }, [rmr.length])

  const handleLogout = () => {
    setUser()
    authStorage.removeToken()
  }

  // const getNotificationToken = async () => {
  //   try {
  //     const token = await Notifications.getExpoPushTokenAsync()
  //     console.log(token)
  //   } catch (error) {
  //     console.log('Error', error)
  //   }
  // }

  return (
    <ScrollView vertical={true}>
      <View style={styles.container}>
        <AppText style={{ fontWeight: '500', fontSize: 30 }}>
          Hi, {user.name}
        </AppText>
        <AppText style={{ fontWeight: '100', fontSize: 13 }}>
          In order to start a call please add your pet below
        </AppText>

        <View style={styles.addPetContainer}>
          {loading ? (
            <LoadingIndicator visible={loading} />
          ) : (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {pets.length > 0 &&
                pets.map((pet) => (
                  <AddPetButton
                    key={pet._id}
                    name={pet.name}
                    img={pet.photo}
                    onPress={() => navigation.navigate('ChooseVet', { pet })}
                  />
                ))}
              <AddPetButton
                title='+'
                onPress={() => navigation.navigate('AddPet')}
              />
            </ScrollView>
          )}
        </View>
        <View style={styles.rmdText}>
          <AppText style={{ fontSize: 25 }}>Your Reminders</AppText>
          <TouchableOpacity
            style={styles.editWrapper}
            onPress={() => navigation.navigate('Reminder')}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Feather name='edit' size={24} color='#000' />
              <AppText style={{ fontSize: 16 }}>EDIT</AppText>
            </View>
          </TouchableOpacity>
        </View>

        {upcomingReminders.length === 0 && todayReminders.length === 0 && (
          <AppText style={{ textAlign: 'center' }}>No Reminders Found</AppText>
        )}
        {todayReminders.length > 0 && (
          <>
            <View style={styles.rmrCard}>
              <AppText style={{ fontSize: 20, color: '#606770' }}>
                Today's Reminders
              </AppText>
              {todayReminders.map((rmr, i) => (
                <AppText key={rmr.identifier} style={styles.rmrText}>
                  {i + 1}).{rmr.reminder}
                </AppText>
              ))}
            </View>
          </>
        )}
        {upcomingReminders.length > 0 && (
          <>
            <View style={styles.rmrCard}>
              <AppText style={{ fontSize: 20, color: '#606770' }}>
                Upcoming Reminders
              </AppText>
              {upcomingReminders.map((rmr, i) => (
                <AppText key={rmr.identifier} style={styles.rmrText}>
                  {i + 1}).{rmr.reminder}
                </AppText>
              ))}
            </View>
          </>
        )}

        <AppText>{user ? user.emailID || user.email : ''}</AppText>
        <AppButton title='Logout' onPress={handleLogout} />
        {/* <AppButton title='Token' onPress={getNotificationToken} /> */}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  addPetContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  bottomCard: {
    marginVertical: 15,
    backgroundColor: '#32a852',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  rmdText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 3,
  },
  editWrapper: {
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    elevation: 5,
  },
  rmrCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
    marginVertical: 15,
    elevation: 0.5,
  },
  rmrText: {
    fontSize: 16,
    paddingBottom: 5,
    paddingLeft: 15,
  },
})

export default HomeScreen

import React, { useContext, useState, useEffect, useCallback } from 'react'
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
  const [rmrLoading, setRmrLoading] = useState(false)

  const isFocused = useIsFocused()
  console.log(isFocused)

  let tr = []

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
  }, [route])

  useEffect(() => {
    setTodayReminders([])
    setUpcomingReminders([])
    const getAllRmr = async () => {
      const data = await getAllKeys()
      console.log(data)
      setRmr(data)
    }

    getAllRmr()
  }, [])

  const removePreviousAndGetReminders = async () => {
    // const ga = await Notifications.getAllScheduledNotificationsAsync()
    // console.log(ga)

    if (rmr.length > 0) {
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
          todayReminders.push(rmr)
          tr.push(rmr)
          console.log(rmr)
        } else {
          upcomingReminders.push(rmr)
        }

        setTodayReminders([...new Set(todayReminders)])
        setUpcomingReminders([...new Set(upcomingReminders)])
      })
    }
  }

  useEffect(() => {
    setRmrLoading(true)
    removePreviousAndGetReminders()
    setRmrLoading(false)
  }, [])

  console.log(tr.length)
  const handleLogout = () => {
    setUser()
    authStorage.removeToken()
  }

  return (
    <ScrollView vertical={true}>
      <View style={styles.container}>
        <AppText style={{ fontWeight: '500', fontSize: 30 }}>
          Hi, Avinash!
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
                    onPress={() => navigation.navigate('ChooseVet')}
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
          <AppText>Your Reminders</AppText>
          <TouchableOpacity
            style={styles.editWrapper}
            onPress={() => console.log('Edit')}
          >
            <AppText style={{ fontSize: 16 }}>EDIT</AppText>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View></View>
        </ScrollView>
        {rmrLoading && <AppText>Loading</AppText>}
        {!rmrLoading && <AppText>{todayReminders.length}</AppText>}
        {/*
        <AppText style={{ fontWeight: '500', fontSize: 22 }}>
          Recent Activity
        </AppText>
        <AppText style={{ fontWeight: '100', fontSize: 13 }}>
          In order to start a call please add your pet below
        </AppText>

        <View style={styles.bottomCard}>
          <AppText style={{ fontWeight: '500', fontSize: 25, color: '#fff' }}>
            Health tip: Feed your pet a nutritious diet.
          </AppText>
          <AppText
            style={{
              fontWeight: '100',
              fontSize: 13,
              color: '#fff',
              lineHeight: 20,
            }}
          >
            In addition to healthy ingredients,select a food that is appropriate
            for your pet's age,health and activity level.
          </AppText>
        </View> */}

        <AppText>{user ? user.emailID || user.email : ''}</AppText>
        <AppButton title='Logout' onPress={handleLogout} />
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
    marginHorizontal: 5,
  },
  editWrapper: {
    backgroundColor: '#fff',
  },
})

export default HomeScreen

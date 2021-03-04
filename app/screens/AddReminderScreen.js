import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Feather } from '@expo/vector-icons'
import { Formik } from 'formik'
import * as Yup from 'yup'
import * as Notifications from 'expo-notifications'

import AppFormPicker from '../components/forms/AppFormPicker'
import AppFormField from '../components/forms/AppFormField'
import AppText from '../components/AppText'
import SubmitButton from '../components/forms/SubmitButton'
import { storeObjectData } from '../components/utils/reminderStorage'

const reminders = [
  { label: 'Deworming', value: 'Deworming' },
  { label: 'Medicine', value: 'Medicine' },
  { label: 'Vaccine', value: 'Vaccine' },
]

const validationSchema = Yup.object().shape({
  reminder: Yup.string().nullable().required('Please select a reminder'),
  notes: Yup.string().max(50, 'Notes must be less than 50 Characters'),
  // mdname: Yup.string().required().label('Medicine name'),
})

const getTom = () => {
  const today = new Date()
  today.setSeconds(0)
  // const tom = new Date(today)
  // tom.setDate(tom.getDate() + 1)
  return today
}

const AddReminderScreen = ({ navigation, route }) => {
  const [date, setDate] = useState(getTom())
  const [endDate, setEndDate] = useState(getTom())
  const [isEndDate, setIsEndDate] = useState(false)
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
  }

  const handleEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate
    setIsEndDate(Platform.OS === 'ios')
    setEndDate(currentDate)
  }

  const showEndDate = () => {
    setIsEndDate(true)
  }

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode('date')
  }

  const showTimepicker = () => {
    showMode('time')
  }

  const scheduleNotification = async (rmr) => {
    let trObj = {}
    if (rmr.reminder === 'Medicine') {
      trObj = {
        hour: 10,
        minute: 0,
        // seconds: 15,
        repeats: true,
      }
    } else {
      date
    }
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your Today Reminders Are Pending',
        body: `${rmr.reminder}`,
      },
      trigger: trObj,
    })
    return identifier
  }

  const handleSubmit = async (values) => {
    if (values.reminder !== 'Medicine') {
      const rmr1 = {
        date,
        ...values,
      }
      const idt1 = await scheduleNotification(rmr1)
      rmr1['identifier'] = idt1
      storeObjectData(
        `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`,
        rmr1
      )

      const yesterday = new Date()
      yesterday.setDate(date.getDate() - 1)
      yesterday.setHours(12)
      yesterday.setSeconds(0)
      yesterday.setMinutes(0)

      const rmr2 = {
        yesterday,
        ...values,
      }

      const idt2 = await scheduleNotification(rmr2)

      rmr2['identifier'] = idt2
      storeObjectData(
        `${yesterday.toLocaleDateString()}-${yesterday.toLocaleTimeString()}`,
        rmr2
      )
    } else {
      const rmr1 = {
        date,
        endDate,
        ...values,
      }
      const idt1 = await scheduleNotification(rmr1)
      rmr1['identifier'] = idt1
      storeObjectData(
        `${endDate.toLocaleDateString()}-${endDate.toLocaleTimeString()}`,
        rmr1
      )
    }

    navigation.navigate('Home')
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          enableReinitialize
          initialValues={{
            reminder: '',
            notes: '',
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values }) => {
            return (
              <>
                <AppFormPicker
                  items={reminders}
                  label='Type Of Reminder'
                  name='reminder'
                />

                {values.reminder === 'Medicine' && (
                  <>
                    <AppFormField
                      label='Medicine Name'
                      autoCapitalize='none'
                      autoCorrect={false}
                      name='medicine'
                      placeholder='Enter medicine name'
                    />
                    <AppText>Choose End Date</AppText>
                    <TouchableOpacity
                      onPress={showEndDate}
                      style={styles.dateTime}
                    >
                      <Feather
                        name='calendar'
                        size={25}
                        color='#6e6969'
                        style={styles.icon}
                      />
                      <AppText style={styles.text}>
                        {endDate.toLocaleDateString()}
                      </AppText>
                    </TouchableOpacity>
                    {isEndDate && (
                      <DateTimePicker
                        testID='dateTimePicker'
                        value={endDate}
                        mode='Date'
                        is24Hour={true}
                        display='default'
                        onChange={handleEndDate}
                        neutralButtonLabel='clear'
                        minimumDate={getTom()}
                      />
                    )}
                  </>
                )}

                <AppText>Choose Time</AppText>

                <TouchableOpacity
                  onPress={showTimepicker}
                  style={styles.dateTime}
                >
                  <Feather
                    name='clock'
                    size={25}
                    color='#6e6969'
                    style={styles.icon}
                  />
                  <AppText style={styles.text}>
                    {date.toLocaleTimeString()}
                  </AppText>
                </TouchableOpacity>

                <AppText
                  style={{ fontSize: 15, marginBottom: 15, color: '#DC143C' }}
                >
                  *Time must be greater than current time for successful
                  reminder
                </AppText>

                <AppText>Choose Date</AppText>
                <TouchableOpacity
                  onPress={showDatepicker}
                  style={styles.dateTime}
                >
                  <Feather
                    name='calendar'
                    size={25}
                    color='#6e6969'
                    style={styles.icon}
                  />
                  <AppText style={styles.text}>
                    {date.toLocaleDateString()}
                  </AppText>
                </TouchableOpacity>

                {show && (
                  <DateTimePicker
                    testID='dateTimePicker'
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display='default'
                    onChange={onChange}
                    neutralButtonLabel='clear'
                    minimumDate={getTom()}
                  />
                )}

                <AppFormField
                  label='Notes (optional)'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='notes'
                  numberOfLines={4}
                  placeholder='Max(50) characters.'
                />

                <SubmitButton title='Add Reminder' />
              </>
            )
          }}
        </Formik>
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
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
  },
  icon: {
    marginRight: 20,
    marginLeft: 10,
  },
  text: {
    fontSize: 20,
    color: '#0c0c0c',
    flex: 1,
  },
})

export default AddReminderScreen

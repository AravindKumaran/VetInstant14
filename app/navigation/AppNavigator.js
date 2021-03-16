import React from 'react'
import { TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import AddPetScreen from '../screens/AddPetScreen'
import AddReminderScreen from '../screens/AddReminderScreen'
import CallVetScreen from '../screens/CallVetScreen'
import ChatScreen from '../screens/ChatScreen'
import ChooseVetScreen from '../screens/ChooseVetScreen'

import HomeScreen from '../screens/HomeScreen'
import OnlineVetScreen from '../screens/OnlineVetScreen'
import PetProblemScreen from '../screens/PetProblemsScreen'
import PetPrescriptionScreen from '../screens/PetPrescription'
import ReminderScreen from '../screens/ReminderScreen'

import { Feather } from '@expo/vector-icons'

const Stack = createStackNavigator()

const AppNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#d8d8d8', //Set Header color
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          title: 'Home', //Set Header Title
          headerTintColor: 'black', //Set Header text color
          headerTitleStyle: {
            fontSize: 20,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Feather
                name='menu'
                size={25}
                color='#000'
                style={{
                  marginLeft: 10,
                  paddingLeft: 20,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name='AddPet'
        component={AddPetScreen}
        options={{
          title: 'Add Pet',
        }}
      />
      <Stack.Screen
        name='ChooseVet'
        component={ChooseVetScreen}
        options={{
          title: 'Select Vet',
        }}
      />
      <Stack.Screen name='Reminder' component={ReminderScreen} />
      <Stack.Screen
        name='AddReminder'
        component={AddReminderScreen}
        options={{
          title: 'Add Reminder',
        }}
      />
      <Stack.Screen name='CallVet' component={CallVetScreen} />
      <Stack.Screen
        name='PetProblems'
        component={PetProblemScreen}
        options={{
          title: 'Pet Problems',
        }}
      />
      <Stack.Screen
        name='PetPrescription'
        component={PetPrescriptionScreen}
        options={{
          title: 'Pet Prescriptions',
        }}
      />
      <Stack.Screen name='OnlineVet' component={OnlineVetScreen} />
      <Stack.Screen name='Chat' component={ChatScreen} />
    </Stack.Navigator>
  )
}

export default AppNavigator

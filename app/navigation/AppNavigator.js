import React from 'react'
import { TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/HomeScreen'
import AddPetScreen from '../screens/AddPetScreen'
import ChooseVetScreen from '../screens/ChooseVetScreen'
import CallVetScreen from '../screens/CallVetScreen'
import OnlineVetScreen from '../screens/OnlineVetScreen'
import ReminderScreen from '../screens/ReminderScreen'
import AddReminderScreen from '../screens/AddReminderScreen'

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
      <Stack.Screen name='AddPet' component={AddPetScreen} />
      <Stack.Screen name='ChooseVet' component={ChooseVetScreen} />
      <Stack.Screen name='Reminder' component={ReminderScreen} />
      <Stack.Screen name='AddReminder' component={AddReminderScreen} />
      <Stack.Screen name='CallVet' component={CallVetScreen} />
      <Stack.Screen name='OnlineVet' component={OnlineVetScreen} />
    </Stack.Navigator>
  )
}

export default AppNavigator
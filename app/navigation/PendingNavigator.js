import React from 'react'
import { TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import CallPendingScreen from '../screens/callPendingScreen'
import VideoCallScreen from '../screens/VideoCallScreen'

import { Feather } from '@expo/vector-icons'

const Stack = createStackNavigator()

const PendingNavigator = ({ navigation }) => {
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
        name='PendingCalls'
        component={CallPendingScreen}
        options={{
          title: 'Pending Calls', //Set Header Title
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
        name='VideoCall'
        component={VideoCallScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default PendingNavigator

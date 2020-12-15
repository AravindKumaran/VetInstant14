import React from 'react'
import { TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import MyVetScreen from '../screens/MyVetScreen'
import SaveVetScreen from '../screens/SaveVetScreen'

import { Feather } from '@expo/vector-icons'

const Stack = createStackNavigator()

const VetNavigator = ({ navigation }) => {
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
        name='MyVet'
        component={MyVetScreen}
        options={{
          title: 'MyVet', //Set Header Title
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
      <Stack.Screen name='SaveVet' component={SaveVetScreen} />
    </Stack.Navigator>
  )
}

export default VetNavigator

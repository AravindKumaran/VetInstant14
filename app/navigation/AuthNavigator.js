import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import AuthScreen from '../screens/AuthScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import WelcomeScreen from '../screens/WelcomeScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import ResetPasswordScreen from '../screens/ResetPasswordScreen'

const Stack = createStackNavigator()

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name='Welcome' component={WelcomeScreen} />
    <Stack.Screen name='Auth' component={AuthScreen} />
    <Stack.Screen name='Register' component={RegisterScreen} />
    <Stack.Screen name='Login' component={LoginScreen} />
    <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
    <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
  </Stack.Navigator>
)

export default AuthNavigator

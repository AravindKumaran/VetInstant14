import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AuthScreen from "../screens/AuthScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import AddPetScreen from "../screens/AddPetScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#FFFFFF", //Set Header color
        elevation: 5,
        borderBottomStartRadius: 15,
        borderBottomEndRadius: 15,
      },
      headerTitleAlign: "center",
    }}
  >
    <Stack.Screen
      options={{
        headerShown: false,
        headerTitleAlign: "center",
      }}
      name="Welcome"
      component={WelcomeScreen}
    />
    <Stack.Screen
      options={{
        headerTitleStyle: {
          color: "#476880",
        },
        headerTitleAlign: "center",
      }}
      name="Auth"
      component={AuthScreen}
    />
    <Stack.Screen
      options={{
        headerTitleStyle: {
          color: "#476880",
        },
        headerTitleAlign: "center",
      }}
      name="Register"
      component={RegisterScreen}
    />
    <Stack.Screen
      options={{
        headerTitleStyle: {
          color: "#476880",
        },
        headerTitleAlign: "center",
      }}
      name="Login"
      component={LoginScreen}
    />
    <Stack.Screen
      options={{
        title: "Forgot Password",
        headerTitleStyle: {
          color: "#476880",
        },
        headerTitleAlign: "center",
      }}
      name="ForgotPassword"
      component={ForgotPasswordScreen}
    />
    <Stack.Screen
      options={{
        headerTitleStyle: {
          color: "#476880",
        },
        headerTitleAlign: "center",
      }}
      name="ResetPassword"
      component={ResetPasswordScreen}
    />
  </Stack.Navigator>
);

export default AuthNavigator;

import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Bottom2 from "../screens/bottom2";
import Bottom3 from "../screens/bottom3";
import HomeScreen from "../screens/HomeScreen";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Keyboard,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AppNavigator from "./AppNavigator";

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: true,
        tabStyle: {
          backgroundColor: "white",
          height: 50,
          bottom: 10,
        },
        inactiveTintColor: "#FFFFFF",
        activeTintColor: "#21FFFC",
        showLabel: false,
        showIcon: true,
        indicatorStyle: {
          opacity: 0.2,
        },
        style: {
          backgroundColor: "white",
          position: "absolute",
          bottom: 0,
          padding: 10,
          height: 50,
          zIndex: 8,
        },
      }}
    >
      <Tab.Screen
        name={"Bottom1"}
        component={AppNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <>
              <Feather
                style={{
                  position: "absolute",
                  color: focused ? "#49D491" : "#47687F",
                }}
                name={"home"}
                size={25}
              />
            </>
          ),
        }}
      />
      <Tab.Screen
        name={"Bottom2"}
        component={Bottom2}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <>
              <Image
                source={require("../../assets/center.png")}
                style={{ bottom: 20, width: 60, height: 60 }}
              />
            </>
          ),
        }}
      />
      <Tab.Screen
        name={"Bottom3"}
        component={Bottom3}
        options={{
          tabBarIcon: ({ focused, tintColor }) => (
            <>
              <Feather
                style={{
                  position: "absolute",
                  color: focused ? "#49D491" : "#47687F",
                }}
                name={"activity"}
                size={25}
              />
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

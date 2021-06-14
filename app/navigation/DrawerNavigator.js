import React from "react";
import { Feather } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AppNavigator from "./AppNavigator";
import VetNavigator from "./VetNavigator";
import CallLogScreen from "../screens/CallLogScreen";
import VetProfile from "../screens/VetProfile";
import AddVet from "../screens/AddVet";
import DrawerContent from "../components/DrawerContent";
import ScheduledCallScreen from "../screens/ScheduledCallScreen";
import PendingNavigator from "./PendingNavigator";
import BottomTab from "../navigation/BottomTab";
import RadioButtonPets from "../screens/RadioButton";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#FFFFFF",
        paddingLeft: 20,
      },
      headerTitleAlign: "center",
      headerTintColor: "#47687F",
    }}
    backBehavior={"order"}
    drawerContentOptions={{
      activeBackgroundColor: "#f2f2f2",
      activeTintColor: "#000000",
      labelStyle: { fontSize: 18 },
      itemStyle: {
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 10,
      },
    }}
    drawerStyle={{
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
    }}
    drawerContent={(props) => <DrawerContent {...props} />}
  >
    <Drawer.Screen
      name="Home"
      // component={AppNavigator}
      component={BottomTab}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name="home" size={size} color={color} />
        ),
        unmountOnBlur: true,
      }}
    />

    <Drawer.Screen
      name="MyVet"
      component={VetNavigator}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name="user-plus" size={size} color={color} />
        ),
        unmountOnBlur: true,
      }}
    />
    <Drawer.Screen
      name="PendingCalls"
      component={PendingNavigator}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name="phone-off" size={size} color={color} />
        ),
        unmountOnBlur: true,
      }}
    />
    <Drawer.Screen
      name="CallLog"
      component={CallLogScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name="phone" size={size} color={color} />
        ),
        headerShown: true,
        unmountOnBlur: true,
        title: "Call Log",
      }}
    />
    <Drawer.Screen
      name="ScheduledCallScreen"
      component={ScheduledCallScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name="phone-outgoing" size={size} color={color} />
        ),
        headerShown: true,
        unmountOnBlur: true,
        title: "Scheduled Calls",
      }}
    />
    {/* <Drawer.Screen
      name='Payments'
      component={AppNavigator}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name='dollar-sign' size={size} color={color} />
        ),
      }}
    /> */}
  </Drawer.Navigator>
);

export default DrawerNavigator;

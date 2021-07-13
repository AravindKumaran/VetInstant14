import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PetLobby from "../screens/PetLobby";
import Room from "../screens/Room";
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
import ChatScreen from "../screens/ChatScreen";
import VetChoice from "../screens/VetChoice";
import EmptyScreen from "../screens/EmptyScreen";

const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }) => {
  const { keyboardHidesTabBars } = useState(true);
  const [didKeyboardShow, setKeyboardShow] = useState(false);
  const [touched, setTouched] = useState(false);

  const toggleTouched = () => {
    setTouched(!touched);
  };

  const seeProfile = () => {
    navigation.navigate("PetLobby");
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setKeyboardShow(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardShow(false);
  };
  return (
    <Tab.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: true,
        tabStyle: {
          backgroundColor: "#FFFFFF",
          height: 50,
          bottom: 10,
          borderTopStartRadius: 15,
          borderTopEndRadius: 15,
          zIndex: 8,
        },
        inactiveTintColor: "#FFFFFF",
        activeTintColor: "#21FFFC",
        showLabel: false,
        showIcon: true,
        indicatorStyle: {
          opacity: 0.2,
        },
        style: {
          backgroundColor: "#FFFFFF",
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
        name={"EmptyScreen"}
        component={EmptyScreen}
        options={{
          tabBarButton: () => <VetChoice />,
          // tabBarIcon: ({ focused, color }) => (
          //   <>
          //     {!didKeyboardShow && (
          //       <Image
          //         source={require("../components/assets/images/center.png")}
          //         style={{
          //           width: 60,
          //           height: 60,
          //           bottom: focused ? -20 : 20,
          //         }}
          //       />
          //     )}
          //   </>
          // ),
          tabBarVisible: false,
        }}
      />
      <Tab.Screen
        name={"PetLobby"}
        component={PetLobby}
        options={{
          tabBarIcon: ({ focused, tintColor }) => (
            <>
              <Feather
                style={{
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

// import React, { useState, useEffect } from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import PetLobby from "../screens/PetLobby";
// import Room from "../screens/Room";
// import HomeScreen from "../screens/HomeScreen";
// import {
//   Image,
//   Text,
//   View,
//   TouchableOpacity,
//   BackHandler,
//   Keyboard,
// } from "react-native";
// import Feather from "react-native-vector-icons/Feather";
// import AppNavigator from "./AppNavigator";
// import ChatScreen from "../screens/ChatScreen";

// const Tab = createBottomTabNavigator();

// const BottomTab = ({ navigation }) => {
//   const { keyboardHidesTabBars } = useState(true);
//   const [didKeyboardShow, setKeyboardShow] = useState(false);
//   const [touched, setTouched] = useState(false);

//   const toggleTouched = () => {
//     setTouched(!touched);
//   };

//   const seeProfile = () => {
//     navigation.navigate("Room");
//   };

//   useEffect(() => {
//     Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
//     Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

//     return () => {
//       Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
//       Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
//     };
//   }, []);

//   const _keyboardDidShow = () => {
//     setKeyboardShow(true);
//   };

//   const _keyboardDidHide = () => {
//     setKeyboardShow(false);
//   };
//   return (
//     <Tab.Navigator
//       tabBarOptions={{
//         keyboardHidesTabBar: true,
//         tabStyle: {
//           backgroundColor: "white",
//           height: 50,
//           bottom: 10,
//         },
//         inactiveTintColor: "#FFFFFF",
//         activeTintColor: "#21FFFC",
//         showLabel: false,
//         showIcon: true,
//         indicatorStyle: {
//           opacity: 0.2,
//         },
//         style: {
//           backgroundColor: "white",
//           position: "absolute",
//           bottom: 0,
//           padding: 10,
//           height: 50,
//           zIndex: 8,
//         },
//       }}
//     >
//       <Tab.Screen
//         name={"Bottom1"}
//         component={AppNavigator}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <>
//               <Feather
//                 style={{
//                   position: "absolute",
//                   color: focused ? "#49D491" : "#47687F",
//                 }}
//                 name={"home"}
//                 size={25}
//               />
//             </>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name={"PetLobby"}
//         component={PetLobby}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <>
//               {!didKeyboardShow && (
//                 <Image
//                   source={require("../../assets/center.png")}
//                   style={{
//                     width: 60,
//                     height: 60,
//                     bottom: touched ? -20 : 20 || 20,
//                   }}
//                 />
//               )}
//             </>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name={"Room"}
//         component={Room}
//         options={{
//           tabBarIcon: ({ focused, tintColor }) => (
//             <>
//               <TouchableOpacity
//                 style={{
//                   width: 100,
//                   height: 50,
//                   justifyContent: "center",
//                 }}
//                 onPress={() => {
//                   setTouched(true);
//                   seeProfile();
//                 }}
//               >
//                 <Feather
//                   style={{
//                     color: focused ? "#49D491" : "#47687F",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     alignSelf: "center",
//                     alignContent: "center",
//                   }}
//                   name={"activity"}
//                   size={25}
//                 />
//               </TouchableOpacity>
//             </>
//           ),
//           tabBarVisible: false,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default BottomTab;

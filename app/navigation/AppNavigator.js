import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AddPetScreen from "../screens/AddPetScreen";
import AddReminderScreen from "../screens/AddReminderScreen";
import CallVetScreen from "../screens/CallVetScreen";
import ChatScreen from "../screens/ChatScreen";
import VideoCallScreen from "../screens/VideoCallScreen";
import ChooseVetScreen from "../screens/ChooseVetScreen";
import PetProfile from "../screens/PetProfile";
import PetScreen from "../screens/PetScreen";
import PetMedication from "../screens/PetMedication";
import PetVaccination from "../screens/PetVaccination";
import HomeScreen from "../screens/HomeScreen";
import OnlineVetScreen from "../screens/OnlineVetScreen";
import PetProblemScreen from "../screens/PetProblemsScreen";
import PetPrescriptionScreen from "../screens/PetPrescription";
import ReminderScreen from "../screens/ReminderScreen";
import RadioButtonPets from "../screens/RadioButton";
import MedicalHistoryPets from "../screens/MedicalHistoryPets";
import PetReminder from "../screens/PetReminder";
import AddVet from "../screens/AddVet";
import VetProfile from "../screens/VetProfile";
import ServiceScreen from "../screens/ServiceScreen";
import MenuScreen from "../screens/MenuScreen";
import { Feather } from "@expo/vector-icons";
import Room from "../screens/Room";

const Stack = createStackNavigator();

const AppNavigator = ({ navigation }) => {
  return (
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
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
        // options={{
        //   title: "VetInstant", //Set Header Title
        //   headerTintColor: "#41CE8A", //Set Header text color
        //   headerTitleStyle: {
        //     fontSize: 20,
        //   },
        //   headerStyle: {
        //     elevation: 5,
        //     borderBottomStartRadius: 15,
        //     borderBottomEndRadius: 15,
        //   },
        //   headerLeft: () => (
        //     <TouchableOpacity onPress={() => navigation.openDrawer()}>
        //       <Feather
        //         name="bar-chart"
        //         size={25}
        //         color="#47687F"
        //         style={{
        //           marginLeft: 10,
        //           paddingLeft: 20,
        //           top: 10,
        //           transform: [{ scaleX: -1 }, { rotate: "270deg" }],
        //         }}
        //       />
        //     </TouchableOpacity>
        //   ),
        //   headerRight: () => (
        //     <Image
        //       source={require("../components/assets/images/doctor1.png")}
        //       style={{
        //         height: 40,
        //         width: 40,
        //         borderRadius: 50,
        //         borderWidth: 2.5,
        //         borderColor: "#6ADFA7",
        //         marginRight: 10,
        //         paddingRight: 20,
        //       }}
        //     />
        //   ),
        // }}
      />
      <Stack.Screen
        name="AddPet"
        component={AddPetScreen}
        options={{
          title: "Add Pet",
        }}
      />
      <Stack.Screen
        name="ChooseVet"
        component={ChooseVetScreen}
        options={{
          title: "Select Vet",
        }}
      />
      <Stack.Screen name="Reminder" component={ReminderScreen} />
      <Stack.Screen
        name="AddReminder"
        component={AddReminderScreen}
        options={{
          title: "Add Reminder",
        }}
      />
      <Stack.Screen name="CallVet" component={CallVetScreen} />
      <Stack.Screen name="RadioButton" component={RadioButtonPets} />

      <Stack.Screen
        name="PetProblems"
        component={PetProblemScreen}
        options={{
          title: "Pet Problems",
        }}
      />

      <Stack.Screen
        name="PetPrescription"
        component={PetPrescriptionScreen}
        options={{
          title: "Pet Prescriptions",
        }}
      />
      <Stack.Screen name="OnlineVet" component={OnlineVetScreen} />
      <Stack.Screen name="Room" component={Room} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Video" component={VideoCallScreen} />
      <Stack.Screen name="PetProfile" component={PetProfile} />
      <Stack.Screen name="PetScreen" component={PetScreen} />
      <Stack.Screen name="PetMedication" component={PetMedication} />
      <Stack.Screen name="PetVaccination" component={PetVaccination} />
      <Stack.Screen name="PetReminder" component={PetReminder} />
      <Stack.Screen name="AddVet" component={AddVet} />
      <Stack.Screen name="VetProfile" component={VetProfile} />
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen
        name="MedicalHistoryPets"
        component={MedicalHistoryPets}
        options={{
          title: "Medical History",
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

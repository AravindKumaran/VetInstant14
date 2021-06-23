import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import ChoosePicker from "../components/forms/ChoosePicker";
import { Formik } from "formik";
import Searchbar from "../components/searchbar";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const type = [
  { label: "Via VetInstant", value: "Via VetInstant" },
  { label: "Vaccinations", value: "Vaccinations" },
  { label: "General Checkup", value: "General Checkup" },
];

const doctors = [
  {
    src: require("../components/assets/images/notification.png"),
    name: "Notifications",
  },
  {
    src: require("../components/assets/images/account.png"),
    name: "Account",
  },
  {
    src: require("../components/assets/images/wallet.png"),
    name: "Wallet",
  },
  {
    src: require("../components/assets/images/invite.png"),
    name: "Invite your Client",
  },
  {
    src: require("../components/assets/images/rating.png"),
    name: "Rate us",
  },
  // {
  //   src: require("../components/assets/images/logout.png"),
  //   name: "Logout",
  // },
];

const MenuScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container1}>
        <View style={styles.cat}>
          {doctors.map((c, i) => (
            <View
              key={`${c.name}-${i}`}
              style={{
                margin: 25,
              }}
            >
              <TouchableOpacity
                // onPress={() => handleCategory(c.name)}
                style={styles.catItem}
              >
                <Text>
                  <Image
                    source={c.src}
                    size={15}
                    style={{ height: 15, width: 15 }}
                  />
                  {"      "}
                  <Text
                    style={{
                      color: "#47687F",
                      fontWeight: "700",
                      fontFamily: "Proxima Nova",
                      fontSize: 14,
                    }}
                  >
                    {c.name}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 50,
          }}
        >
          <Image source={require("../components/assets/images/logout.png")} />
          <Text
            style={{
              color: "#FF5348",
              fontWeight: "700",
              fontFamily: "Proxima Nova",
              fontSize: 14,
              marginHorizontal: 20,
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    margin: 30,
  },
});

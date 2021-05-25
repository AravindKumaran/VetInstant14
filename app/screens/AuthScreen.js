import React, { useState, useContext, useEffect } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-community/google-signin";
import { StyleSheet, View, Text } from "react-native";

import AppButton from "../components/AppButton";

import authStorage from "../components/utils/authStorage";
import AuthContext from "../context/authContext";
import LoadingIndicator from "../components/LoadingIndicator";

import authApi from "../api/auth";
import usersApi from "../api/users";

const AuthScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState();

  const { title } = route.params;

  const { setUser } = useContext(AuthContext);

  const handlePress = () => {
    navigation.navigate(`${title}`);
  };

  const signIn = async () => {
    await GoogleSignin.configure({
      androidClientId:
        "320113619885-drs735a38tcvfq000k0psg7t60c8nfff.apps.googleusercontent.com",
    });
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // console.log('User', userInfo.user)
      const password = userInfo.user.id + Date.now();
      const res = await authApi.saveGoogleUser(
        userInfo.user.name,
        userInfo.user.email,
        password
      );
      if (!res.ok) {
        setLoading(false);
        // setError(res.data.msg);
        console.log(res);
        return;
      }
      authStorage.storeToken(res.data.token);
      const userRes = await usersApi.getLoggedInUser();
      setUser(userRes.data.user);

      setLoading(false);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("e 1");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("e 2");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("e 3");
      } else {
        console.log("Eror", error);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingIndicator visible={loading} />
      <View style={styles.container}>
        {/* <View>
          <Text style={styles.text}>VetInstant</Text>
          <Text style={styles.title}>{title}</Text>
        </View> */}

        <AppButton title="Continue with Email ID" onPress={handlePress} />

        <AppButton title="Continue with Google" onPress={signIn} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 25,
  },
  title: {
    fontSize: 22,
    alignSelf: "center",
  },
  googleBtn: {
    width: "100%",
    // backgroundColor: 'red',
  },
});

export default AuthScreen;

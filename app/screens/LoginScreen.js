import React, { useState, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-community/google-signin";

import AppText from "../components/AppText";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import ErrorMessage from "../components/forms/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";

import authApi from "../api/auth";
import AuthContext from "../context/authContext";
import authStorage from "../components/utils/authStorage";

import usersApi from "../api/users";
import socket from "../components/utils/socket";

import LinearGradient from "react-native-linear-gradient";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(8).label("Password"),
});

const LoginScreen = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    const res = await authApi.login(email, password);
    if (!res.ok) {
      console.log("Res", res);
      setLoading(false);
      setError(res.data?.msg ? res.data.msg : "Something Went Wrong.");
      return;
    }
    setError(null);
    authStorage.storeToken(res.data.token);
    const userRes = await usersApi.getLoggedInUser();
    if (!userRes.ok) {
      setLoading(false);
      console.log(userRes);
      return;
    }
    console.log("Socket", socket);
    socket.emit("online", userRes.data.user._id);
    setUser(userRes.data.user);
    setLoading(false);
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
        {/* <AppText
          style={{
            textAlign: 'center',
            marginBottom: 30,
            fontSize: 22,
            fontWeight: '500',
          }}
        >
          Login
        </AppText> */}

        <View style={{ marginTop: 60, marginHorizontal: 30 }}>
          <TouchableOpacity onPress={signIn}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#F6F6F6", "#FFFFFF"]}
              style={{
                borderRadius: 75,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                alignSelf: "center",
                padding: 10,
                width: 320,
                height: 60,
                marginBottom: 20,
                borderWidth: 0.5,
                borderColor: "#15385F",
              }}
            >
              <Image source={require("../../assets/google.png")} />
            </LinearGradient>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                marginLeft: "17%",
                flex: 1,
                height: 1,
                backgroundColor: "#47687F",
              }}
            />
            <View>
              <Text style={styles.text1}>OR</Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#47687F",
                marginRight: "17%",
              }}
            />
          </View>
          {error && <ErrorMessage error={error} visible={!loading} />}
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <>
                <AppFormField
                  icon="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  name="email"
                  placeholder="Username"
                />

                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="lock"
                  name="password"
                  placeholder="Password"
                  secureTextEntry
                  placeholder="Password"
                />

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <AppText
                    style={{
                      textAlign: "center",
                      fontSize: 14,
                      color: "#47687F",
                      fontWeight: "700",
                    }}
                  >
                    Forgot Password?
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ alignSelf: "center", paddingTop: 5 }}
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={{ fontSize: 14, fontWeight: "700" }}>
                    <Text style={{ color: "#47687F" }}>New to the app?</Text>{" "}
                    <Text style={{ color: "#49D491" }}>Sign Up</Text>
                  </Text>
                </TouchableOpacity>
                <View style={{ top: 150 }}>
                  <SubmitButton title="Login" />
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 0,
    backgroundColor: "#FFFFFF",
    // justifyContent: "center",
  },
  text1: {
    color: "#47687F",
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
    paddingRight: "5%",
    paddingLeft: "5%",
  },
});

export default LoginScreen;

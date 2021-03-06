import React, { useState, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

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
                placeholder="Email id"
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    // marginTop: 60,
    justifyContent: "center",
  },
});

export default LoginScreen;

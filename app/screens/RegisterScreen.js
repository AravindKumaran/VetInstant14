import React from "react";
import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppFormField from "../components/AppFormField";
import SubmitButton from "../components/SubmitButton";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  cnfPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password do not match")
    .label("Confirm Password"),
});

const RegisterScreen = () => {
  return (
    <View style={styles.container}>
      <AppText>Register</AppText>

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => console.log(values)}
        validationSchema={validationSchema}
      >
        {() => (
          <>
            <AppFormField
              icon='email'
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='email-address'
              name='email'
              placeholder='Enter your email id'
            />

            <AppFormField
              autoCapitalize='none'
              autoCorrect={false}
              icon='lock'
              name='password'
              secureTextEntry
              placeholder='Enter your password'
            />

            <AppFormField
              autoCapitalize='none'
              autoCorrect={false}
              icon='lock'
              name='cnfPassword'
              secureTextEntry
              placeholder='Retype your password'
            />

            <SubmitButton title='Register' />
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 60,
  },
});

export default RegisterScreen;

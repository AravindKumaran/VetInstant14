import React from "react";

import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import { StyleSheet, View, Text } from "react-native";
import ImagePickerBottomSheet from "./ImagePickerBottomSheet";

const AppImagePicker = ({ name }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  return (
    <View>
      <ImagePickerBottomSheet
        imageUri={values[name]}
        onChangeImage={(uri) => setFieldValue(name, uri)}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default AppImagePicker;

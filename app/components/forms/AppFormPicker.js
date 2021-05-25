import React from "react";
import { useFormikContext } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

import ErrorMessage from "./ErrorMessage";
import AppText from "../AppText";

import { StyleSheet } from "react-native";

const AppFormPicker = ({ label, items, name, placeholder }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <AppText>{label}</AppText>
      <RNPickerSelect
        useNativeAndroidPickerStyle={false}
        onValueChange={(value) => setFieldValue(name, value)}
        style={pickerSelectStyles}
        items={items}
        value={values[name]}
        placeholder={placeholder}
        Icon={() => (
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#000"
            style={{ elevation: 10 }}
          />
        )}
      />

      <ErrorMessage error={errors[name]} visible={!values[name]} />
    </>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: "#FFFFFF",
    fontSize: 18,
    padding: 18,
    borderRadius: 10,
    marginVertical: 10,
    color: "#47687F",
    flex: 1,
    overflow: "scroll",
    paddingRight: 30,
    elevation: 10,
  },
  inputAndroid: {
    backgroundColor: "#FFFFFF",
    fontSize: 18,
    padding: 18,
    borderRadius: 10,
    marginVertical: 10,
    color: "#47687F",
    flex: 1,
    overflow: "scroll",
    paddingRight: 30,
    elevation: 10,
  },
  iconContainer: {
    top: 30,
    right: 12,
    elevation: 10,
  },
});
export default AppFormPicker;

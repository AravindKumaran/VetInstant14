import React, { useState } from "react";

import { StyleSheet, View, Dimensions } from "react-native";
import { useFormikContext } from "formik";
import ErrorMessage from "./ErrorMessage";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { MaterialIcons } from "@expo/vector-icons";
import AppText from "../AppText";

const AppMultiSelect = ({ label, items, name }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <AppText>{label}</AppText>
      <View style={styles.container}>
        <SectionedMultiSelect
          items={items}
          IconRenderer={MaterialIcons}
          uniqueKey="name"
          subKey="children"
          selectText="Select items..."
          showDropDowns={false}
          readOnlyHeadings={false}
          onSelectedItemsChange={(selectedItems) =>
            setFieldValue(name, selectedItems)
          }
          selectedItems={values[name]}
          showChips={false}
          styles={{
            selectedItemText: {
              color: "blue",
            },
            container: {
              padding: 20,
            },
            item: {
              margin: 10,
            },
            button: {
              backgroundColor: "#fc5c65",
              borderRadius: 8,
            },
          }}
        />
      </View>
      <ErrorMessage error={errors[name]} visible={values[name]} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    fontSize: 18,
    paddingHorizontal: 2,
    paddingTop: 5,
    borderRadius: 10,
    marginVertical: 10,
    color: "#0c0c0c",
  },
  listContainer: {
    padding: 50,
  },
});

export default AppMultiSelect;

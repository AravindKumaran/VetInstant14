import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { Header } from "react-native-elements";
import ChoosePicker from "../components/forms/ChoosePicker";
import { Formik } from "formik";
import RadioForm from "react-native-simple-radio-button";
import AppButton from "../components/AppButton";
import AppImageListPicker from "../components/forms/AppImageListPicker";
import CheckboxList from "rn-checkbox-list";
import RBSheet from "react-native-raw-bottom-sheet";
import VideoAuthentication from "../screens/VideoAuthentication";

const MyCustomLeftComponent = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Feather
        style={{
          // position: "absolute",
          color: "#476880",
          right: 0,
          top: 0,
        }}
        name={"arrow-left"}
        size={25}
      />
    </TouchableOpacity>
  );
};

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const Appetite = [
  { label: "Normal", value: "Normal" },
  { label: "Not Observed", value: "Not Observed" },
  { label: "Different from Normal", value: "Different from Normal" },
];

const Behaviour = [
  { label: "Normal", value: "Normal" },
  { label: "Not Observed", value: "Not Observed" },
  { label: "Different from Normal", value: "Different from Normal" },
];

const Activity = [
  { label: "Normal", value: "Normal" },
  { label: "Not Observed", value: "Not Observed" },
  { label: "Different from Normal", value: "Different from Normal" },
];

const Feces = [
  { label: "Normal", name: "Normal" },
  { label: "Not Observed", name: "Not Observed" },
  { label: "Abnormal Colour", name: "Abnormal Colour" },
  { label: "Abnormal Odour", name: "Abnormal Odour" },
  { label: "Worms", name: "Worms" },
];

const Feces1 = [
  { id: 1, name: "Normal" },
  { id: 2, name: "Not Observed" },
  { id: 3, name: "Abnormal Colour" },
  { id: 4, name: "Abnormal Odour" },
  { id: 5, name: "Worms" },
];

const Urine = [
  { label: "Normal", name: "Normal" },
  { label: "Not Observed", name: "Not Observed" },
  { label: "Abnormal Colour", name: "Abnormal Colour" },
  { label: "Abnormal Odour", name: "Abnormal Odour" },
  { label: "Worms", name: "Worms" },
];

const Eyes = [
  { label: "Normal", value: "Normal" },
  { label: "Abnormal Discharge", value: "Abnormal Discharge" },
];

const Mucous = [
  { label: " White", value: "White" },
  { label: " Pink-White", value: "Pink-White" },
  { label: " Pink", value: "Pink" },
  { label: " Red-Pink", value: "Red-Pink" },
  { label: " Red", value: "Red" },
  //   { label: " Dark Red", value: "Dark Red" },
  { label: " Yellow", value: "Yellow" },
];

const Ears = [
  { label: "Normal", name: "Normal" },
  { label: "Abnormal Discharge", name: "Abnormal Discharge" },
  { label: "Abnormal Odour", name: "Abnormal Odour" },
  //   { label: "Abnormal appearance", name: "Abnormal appearance" },
];

const Ears1 = [
  { id: 1, name: "Normal" },
  { id: 2, name: "Abnormal Discharge" },
  { id: 3, name: "Abnormal Odour" },
];

const Nose = [
  { label: "Normal", value: "Normal" },
  { label: "Abnormal Discharge", value: "Abnormal Discharge" },
];

const Skin = [
  { label: "Normal", name: "Normal" },
  { label: "Injuries", name: "Injuries" },
  { label: "Odour", name: "Odour" },
  { label: "Hairfall", name: "Hairfall" },
  { label: "Rough Coat", name: "Rough Coat" },
  { label: "Changes in Appearance", name: "Changes in Appearance" },
];

const Skin1 = [
  { id: 1, name: "Normal" },
  { id: 2, name: "Injuries" },
  { id: 3, name: "Odour" },
  { id: 4, name: "Hairfall" },
  { id: 5, name: "Rough Coat" },
  { id: 6, name: "Changes in Appearance" },
];

const Gait = [
  { label: "Normal", value: "Normal" },
  { label: "Not Observed", value: "Not Observed" },
  { label: "Different from Normal", value: "Different from Normal" },
];

const Months = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
];

const Days = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
  { label: "13", value: "13" },
  { label: "14", value: "14" },
  { label: "15", value: "15" },
  { label: "16", value: "16" },
  { label: "17", value: "17" },
  { label: "18", value: "18" },
  { label: "19", value: "19" },
  { label: "20", value: "20" },
];

const RadioButtonPets = () => {
  const [isSelected, setisSelected] = useState(false);
  const refRBSheet = useRef();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header
        leftComponent={<MyCustomLeftComponent />}
        centerComponent={{
          text: "Video Call",
          style: { color: "#476880", fontSize: 20, fontWeight: "700", top: 0 },
        }}
        containerStyle={{
          backgroundColor: "#ffffff",
          height: 80,
        }}
      />
      <Formik
        initialValues={{
          pet: "",
        }}
      >
        <>
          <View style={{ margin: 25 }}>
            <View
              style={{ width: "110%", alignSelf: "center", paddingBottom: 20 }}
            >
              <ChoosePicker
                items={pet}
                label="Choose your pet"
                name="pet"
                placeholder="Choose your pet"
              />
            </View>

            <Text style={styles.text1}>Facing problems in</Text>
            <TextInput
              style={styles.textinput1}
              placeholder="Describe the problem..."
            />

            <Text style={styles.text1}>
              Since when is the problem happening?
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                alignContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View style={{ width: "50%" }}>
                <ChoosePicker
                  items={Months}
                  label="Months"
                  name="Months"
                  placeholder="Months"
                />
              </View>
              <View style={{ width: "50%" }}>
                <ChoosePicker
                  items={Days}
                  label="Days"
                  name="Days"
                  placeholder="Days"
                />
              </View>
            </View>

            <Text style={styles.text1}>Appetite</Text>
            <RadioForm
              radio_props={Appetite}
              initial={null}
              formHorizontal={false}
              labelHorizontal={true}
              labelColor={"#47687F"}
              animation={true}
              onPress={setisSelected}
              buttonColor={"#B9C4CF"}
              selectedButtonColor={"#60E6A6"}
            />

            <Text style={styles.text1}>General Behaviour</Text>
            <RadioForm
              radio_props={Behaviour}
              initial={null}
              formHorizontal={false}
              labelHorizontal={true}
              labelColor={"#47687F"}
              animation={true}
              onPress={setisSelected}
              buttonColor={"#B9C4CF"}
              selectedButtonColor={"#60E6A6"}
            />

            <Text style={styles.text1}>Activity</Text>
            <RadioForm
              radio_props={Activity}
              initial={null}
              formHorizontal={false}
              labelHorizontal={true}
              labelColor={"#47687F"}
              animation={true}
              onPress={setisSelected}
              buttonColor={"#B9C4CF"}
              selectedButtonColor={"#60E6A6"}
            />

            <Text style={styles.text1}>Feces</Text>
            <CheckboxList
              theme="#41CE8A"
              listItems={Feces1}
              listItemStyle={{
                color: "#47687F",
                margin: -5,
              }}
            />
            <Text style={styles.text2}>Comments</Text>
            <TextInput
              style={styles.textinput1}
              placeholder="Describe the problem..."
            />

            <Text style={styles.text1}>Urine</Text>
            <RadioForm
              radio_props={Urine}
              initial={null}
              formHorizontal={false}
              labelHorizontal={true}
              labelColor={"#47687F"}
              animation={true}
              onPress={setisSelected}
              buttonColor={"#B9C4CF"}
              selectedButtonColor={"#60E6A6"}
            />
            <Text style={styles.text2}>Comments</Text>
            <TextInput
              style={styles.textinput1}
              placeholder="Describe the problem..."
            />

            <Text style={styles.text1}>Eyes</Text>
            <RadioForm
              radio_props={Eyes}
              initial={null}
              formHorizontal={false}
              labelHorizontal={true}
              labelColor={"#47687F"}
              animation={true}
              onPress={setisSelected}
              buttonColor={"#B9C4CF"}
              selectedButtonColor={"#60E6A6"}
            />

            <Text style={styles.text1}>Mucous Membrane of the Eye</Text>
            <Text style={styles.text3}>
              Gently pull down a lower eyellabel with a finger and note its
              colour. Choose the most appropriate colour description below.
            </Text>
            <RadioForm
              radio_props={Mucous}
              initial={null}
              formHorizontal={false}
              labelHorizontal={true}
              labelColor={"#47687F"}
              animation={true}
              onPress={setisSelected}
              buttonColor={"#B9C4CF"}
              selectedButtonColor={"#60E6A6"}
            />

            <Text style={styles.text1}>Ears</Text>
            <CheckboxList
              theme="#41CE8A"
              listItems={Ears1}
              listItemStyle={{
                color: "#47687F",
                margin: -5,
              }}
            />

            <Text style={styles.text1}>Nose</Text>
            <RadioForm
              radio_props={Nose}
              initial={null}
              formHorizontal={false}
              labelHorizontal={true}
              labelColor={"#47687F"}
              animation={true}
              onPress={setisSelected}
              buttonColor={"#B9C4CF"}
              selectedButtonColor={"#60E6A6"}
            />

            <Text style={styles.text1}>Skin and Coats</Text>
            <CheckboxList
              theme="#41CE8A"
              listItems={Skin1}
              listItemStyle={{
                color: "#47687F",
                margin: -5,
              }}
            />
            <Text style={styles.text2}>Comments</Text>
            <TextInput
              style={styles.textinput1}
              placeholder="Describe the problem..."
            />

            <Text style={styles.text1}>Gait</Text>
            <RadioForm
              radio_props={Gait}
              initial={null}
              formHorizontal={false}
              labelHorizontal={true}
              labelColor={"#47687F"}
              animation={true}
              onPress={setisSelected}
              buttonColor={"#B9C4CF"}
              selectedButtonColor={"#60E6A6"}
            />

            <Text style={styles.text1}>General Comments</Text>
            <TextInput
              style={styles.textinput1}
              placeholder="Describe the problem..."
            />

            <Text style={styles.text1}>Add Pictures or Videos</Text>
            <View style={{ left: 100 }}>
              <AppImageListPicker name="images" />
            </View>
          </View>
        </>
      </Formik>
      <AppButton
        title="Start a video call"
        onPress={() => refRBSheet.current.open()}
      />
      <RBSheet
        ref={refRBSheet}
        height={Dimensions.get("window").height - 500}
        animationType="fade"
        closeOnDragDown={false}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,.6)",
          },
          draggableIcon: {
            backgroundColor: "#C4C4C4",
          },
          container: {
            backgroundColor: "#FFFFFF",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            bottom: "40%",
            width: "95%",
            alignSelf: "center",
          },
        }}
      >
        <VideoAuthentication />
      </RBSheet>
      <Text style={styles.text4}>(Video calls applies consultation fees)</Text>
    </ScrollView>
  );
};
export default RadioButtonPets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  choose: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  catItem1: {
    alignSelf: "center",
    marginTop: 30,
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 14,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
  text2: {
    color: "#47687F",
    fontSize: 14,
    fontWeight: "700",
    paddingTop: 20,
    margin: 20,
  },
  text3: {
    color: "#A2ABB5",
    fontSize: 12,
    fontWeight: "400",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    bottom: 10,
  },
  text4: {
    color: "#47687F",
    fontSize: 10,
    fontWeight: "400",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    bottom: 15,
  },
  textinput1: {
    width: "100%",
    height: 150,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B9C4CF",
    margin: 20,
    alignSelf: "center",
    paddingBottom: 100,
    paddingLeft: 10,
  },
  textinput2: {
    width: "80%",
    height: 60,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#B9C4CF",
    margin: 0,
    alignSelf: "center",
    paddingBottom: 0,
    paddingLeft: 0,
  },
  catItem2: {
    flexDirection: "row",
    alignItems: "flex-end",
    bottom: 20,
    borderRadius: 30,
  },
});

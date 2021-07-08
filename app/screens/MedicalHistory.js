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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { Header } from "react-native-elements";
import ReminderScreen from "./ReminderScreen";
import PetPrescriptionScreen from "../screens/PetPrescription";
import AppText from "../components/AppText";
import ChoosePicker from "../components/forms/ChoosePicker";
import { Formik } from "formik";
import { ScrollView } from "react-native-gesture-handler";
import Searchbar from "../components/searchbar";
import petsApi from "../api/pets";

const MedicalHistory = ({user, currentCall}) => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState(null);
  const [problemTypes, setProblemTypes] = useState([]);

  useEffect(() => {
    const getPets = async () => {
      setLoading(true);
      const res = await petsApi.getPets();
      if (!res.ok) {
        setLoading(false);
        console.log(res);
      }      
  
      const petRes = res.data.pets.map(function(pet) {
        return {
          name: pet.name,
          id: pet._id
        }
      });
      // console.log('petRes', petRes);
  
      let petArr = [];
      petRes.forEach(el => {
        let petObj = {label: el.name, value:el.id};
        petArr.push(petObj)
      });
      // console.log('petArr', petArr);
      setPets(petArr);
  
      setLoading(false);
    }; 

    getPets();
  }, []);    

  const changePetAndProblem = async (petId, problemType) => {
    setLoading(true);
    const pres = await petsApi.getSinglePet(petId);
    if (!pres.ok) {
      console.log("Error", pres);
      setLoading(false);
      return;
    }
    console.log('pres', pres.data.exPet.prescriptions);
    console.log('problemType', problemType);

    if(problemType == undefined){
      setPrescriptions(pres.data.exPet.prescriptions);
    }else{
      setPrescriptions(
        pres.data.exPet.prescriptions.filter(pres=>pres.prescription==problemType)
      )
    }    

    let probArr = [];
    pres.data.exPet.problems.map(function(prob) {
      probArr.push({
        label: prob.problem,
        value: prob.problem
      })
    });
    setProblemTypes(probArr)
    setLoading(false);
  }

  const handleSubmit = async (values) => {
    // console.log('values', values);  
    changePetAndProblem(values.pet, values.problemType);   
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container1}>
        <Formik
          initialValues={{
            pet: currentCall.petId,
          }}
          onSubmit={handleSubmit}
        >
        {({ handleSubmit }) => (
          <>
            <ChoosePicker
              items={pets}
              label="Pet name"
              name="pet"
              placeholder="Choose your pet"
              onChange={(e)=>{
                handleSubmit(e)
              }}
            />
            <View style={{ marginTop: 20 }}>
              <ChoosePicker
                items={problemTypes}
                label="Problem type"
                name="problemType"
                placeholder="Problem type"
                onChange={(e)=>{
                  handleSubmit(e)
                }}
              />
            </View>
          </>
        )}
        </Formik>
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            alignSelf: "center",
            marginVertical: 10,
            marginRight: 10,
          }}
        >
          <Searchbar />
          <TouchableOpacity>
            <Feather
              name={"plus"}
              size={40}
              color={"#41CE8A"}
              style={{
                alignSelf: "center",
                borderRadius: 50,
                elevation: 10,
                backgroundColor: "#FFFFFF",
              }}
            />
          </TouchableOpacity>
        </View>
        {prescriptions && (
          prescriptions.map((pres, i) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 105,
                width: "95%",
                alignSelf: "center",
                borderRadius: 20,
                padding: 10,
                elevation: 10,
                backgroundColor: "#FFFFFF",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  height: 75,
                  width: 75,
                  borderRadius: 20,
                  backgroundColor: "rgba(65, 206, 138, 0.2)",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                  }}
                >
                  {new Date(pres.date).toLocaleDateString("default",{month:"short"})} 
            
                </Text>
              </View>
              <View style={{ marginRight: 150, marginHorizontal: 20 }}>
                <Text style={{ color: "#47687F", fontSize: 14, fontWeight: "700" }}>
                  {pres.prescription}
                </Text>
                <Text style={{ color: "#B9C4CF", fontSize: 12, fontWeight: "400" }}>
                  Treated by Dr. {pres.docname} at Global Veteneriary Hospitals
                </Text>
              </View>
              <View style={{ right: 120 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MedicalHistoryPets")}
                >
                  <Text
                    style={{ color: "#41CE8A", fontWeight: "700", fontSize: 14 }}
                  >
                    VIEW
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default MedicalHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    marginVertical: 30,
    marginHorizontal: 0,
  },
  choose: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  catItem1: {
    // flexDirection: "column",
    alignSelf: "center",
    marginTop: 30,
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
    paddingHorizontal: 20,
  },
  text2: {
    color: "#FA7C7C",
    fontSize: 14,
    fontWeight: "400",
  },
  text3: {
    color: "#37CF86",
    fontSize: 12,
    fontWeight: "400",
  },
  catItem2: {
    flexDirection: "row",
    alignItems: "flex-end",
    bottom: 20,
    borderRadius: 30,
  },
});

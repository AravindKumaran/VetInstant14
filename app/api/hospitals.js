import client from "./client";

const endPoint = "/hospitals";

const getHospitals = () => client.get(endPoint);

const getHospitalsDoctors = (hospitalId) =>
  client.get(`${endPoint}/${hospitalId}/doctors`);
const getOtherDoctorsFromHospital = (hospitalId, doctorId) => {
  return client.post(`${endPoint}/doc`, {
    hospitalId: hospitalId,
    doctorId: doctorId,
  });
};
const getSingleHospital = (hospitalId) =>
  client.get(`${endPoint}/${hospitalId}`);

export default {
  getHospitals,
  getHospitalsDoctors,
  getSingleHospital,
  getOtherDoctorsFromHospital,
};

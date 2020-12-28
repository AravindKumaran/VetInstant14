import client from './client'

const endPoint = '/doctors'

const getSingleDoctor = (doctorId) => client.get(`${endPoint}/${doctorId}`)

const getOnlineDoctors = () => client.get(`${endPoint}/online/available`)

const savePatientDetails = (patient, id) =>
  client.patch(`${endPoint}/savepatient/${id}`, patient)

export default {
  getSingleDoctor,
  getOnlineDoctors,
  savePatientDetails,
}

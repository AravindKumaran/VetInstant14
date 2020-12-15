import client from './client'

const endPoint = '/hospitals'

const getHospitals = () => client.get(endPoint)

const getHospitalsDoctors = (hospitalId) =>
  client.get(`${endPoint}/${hospitalId}/doctors`)

const getSingleHospital = (hospitalId) =>
  client.get(`${endPoint}/${hospitalId}`)

export default {
  getHospitals,
  getHospitalsDoctors,
  getSingleHospital,
}

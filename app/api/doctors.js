import client from './client'

const endPoint = '/doctors'

const getSingleDoctor = (doctorId) => client.get(`${endPoint}/${doctorId}`)

const getOnlineDoctors = () => client.get(`${endPoint}/online/available`)

export default {
  getSingleDoctor,
  getOnlineDoctors,
}

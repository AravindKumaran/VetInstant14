import client from './client'

const endPoint = '/doctors'

const getSingleDoctor = (doctorId) => client.get(`${endPoint}/${doctorId}`)

export default {
  getSingleDoctor,
}

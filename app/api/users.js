import client from './client'

const endPoint = '/users'

const getUsers = () => client.get(endPoint)

const getLoggedInUser = () => {
  return client.patch(`${endPoint}/me`)
}

const saveVet = (hospitalId, doctorId) => {
  return client.patch(`${endPoint}/updateVet`, { hospitalId, doctorId })
}

const payDoctor = (data) => {
  return client.post(`${endPoint}/paydoctor`, data)
}

const verifyPayment = (data) => {
  return client.post(`${endPoint}/verifyPayment`, data)
}

const getVideoToken = (username) => {
  return client.get(`${endPoint}/getToken/?userName=${username}`)
}

export default {
  getUsers,
  getLoggedInUser,
  saveVet,
  payDoctor,
  verifyPayment,
  getVideoToken,
}

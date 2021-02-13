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

const getVideoToken = (data) => {
  return client.post(`${endPoint}/getToken`, data)
}

const createPushToken = (token) => {
  return client.patch(`${endPoint}/saveToken`, token)
}

const getPushToken = (id) => {
  return client.get(`${endPoint}/getPushToken/${id}`)
}

const sendPushNotification = (data) => {
  return client.post(`${endPoint}/sendNotification`, data)
}

export default {
  getUsers,
  getLoggedInUser,
  saveVet,
  payDoctor,
  verifyPayment,
  getVideoToken,
  createPushToken,
  getPushToken,
  sendPushNotification,
}

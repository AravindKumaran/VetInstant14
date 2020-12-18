import client from './client'

const endPoint = '/users'

const getUsers = () => client.get(endPoint)

const getLoggedInUser = () => {
  return client.patch(`${endPoint}/me`)
}

const saveVet = (hospitalId, doctorId) => {
  return client.patch(`${endPoint}/updateVet`, { hospitalId, doctorId })
}

export default {
  getUsers,
  getLoggedInUser,
  saveVet,
}

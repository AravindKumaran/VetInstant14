import client from './client'

const endPoint = '/calllogs'

const getCallLog = (id) => {
  return client.get(`${endPoint}?senderId=${id}`)
}

const saveCallLog = (data) => {
  return client.post(`${endPoint}`, data)
}

const updateCallLog = (id) => {
  return client.patch(`${endPoint}/${id}`)
}

export default {
  getCallLog,
  saveCallLog,
  updateCallLog,
}

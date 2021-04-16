import client from './client'

const endPoint = '/pendingcalls'

const saveCallPending = (data) => {
  return client.post(`${endPoint}`, data)
}

const getCallPendingByUser = (userId) => {
  return client.get(`${endPoint}/user/${userId}`)
}

const updateCallPending = (id, data) => {
  return client.patch(`${endPoint}/${id}`, data)
}

const deleteCallPending = (id) => {
  return client.delete(`${endPoint}/${id}`)
}
const deleteCallPendingAfter = (id) => {
  return client.delete(`${endPoint}/after/${id}`)
}
const singleCallPending = (id) => {
  return client.get(`${endPoint}/${id}`)
}

export default {
  saveCallPending,
  getCallPendingByUser,
  updateCallPending,
  deleteCallPending,
  deleteCallPendingAfter,
  singleCallPending,
}

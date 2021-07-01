import client from './client'

const endPoint = '/rooms'

const createRoom = (room) => {
  return client.post(endPoint, room)
}

const getReceiverRoom = (id) => {
  return client.get(`${endPoint}/receiver/${id}`)
}

export default {
  createRoom,
  getReceiverRoom
}

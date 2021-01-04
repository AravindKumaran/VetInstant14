import client from './client'

const endPoint = '/rooms'

const createRoom = (room) => {
  return client.post(endPoint, room)
}

export default {
  createRoom,
}

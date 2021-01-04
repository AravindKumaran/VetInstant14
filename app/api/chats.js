import client from './client'

const endPoint = '/chats'

const createChat = (chat) => {
  return client.post(endPoint, chat)
}

const getRoomAllChat = (name) => {
  return client.get(`${endPoint}/room/${name}`)
}

export default {
  createChat,
  getRoomAllChat,
}

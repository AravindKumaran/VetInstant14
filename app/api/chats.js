import client from './client'

const endPoint = '/chats'

const createChat = (chat) => {
  return client.post(endPoint, chat)
}

const getRoomAllChat = (name, petid) => {
  return client.get(`${endPoint}/room/${name}/${petid}`)
}

export default {
  createChat,
  getRoomAllChat,
}

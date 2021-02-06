import client from './client'

const endPoint = '/scheduledCalls'

const getScheduledCall = () => {
  return client.get(`${endPoint}`)
}

export default {
  getScheduledCall,
}

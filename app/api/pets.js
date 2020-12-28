import client from './client'

const endPoint = '/pets'

const getPets = () => client.get(endPoint)

const getSinglePet = (id) => client.get(`${endPoint}/${id}`)

const savePet = (pets) => client.post(endPoint, pets)

const savePetProblems = (problem, id) =>
  client.patch(`${endPoint}/problems/${id}`, problem)

export default {
  getPets,
  getSinglePet,
  savePet,
  savePetProblems,
}

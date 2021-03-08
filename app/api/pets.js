import client from './client'

const endPoint = '/pets'

const getPets = () => client.get(endPoint)

const getSinglePet = (id) => client.get(`${endPoint}/${id}`)

const savePet = (pet) => client.post(endPoint, pet)
const updatePet = (id, pet) => client.patch(`${endPoint}/${id}`, pet)

const savePetProblems = (problem, id) =>
  client.patch(`${endPoint}/problems/${id}`, problem)

export default {
  getPets,
  getSinglePet,
  savePet,
  savePetProblems,
  updatePet,
}

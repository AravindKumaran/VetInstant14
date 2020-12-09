import client from "./client";

const endPoint = "/pets";

const getPets = () => client.get(endPoint);

const savePet = (pets) => client.post(endPoint, pets);

export default {
  getPets,
  savePet,
};

import client from "./client";

const login = (emailID, password) =>
  client.post("/auth/login", { emailID, password });

const register = (name, emailID, password, role = "user") =>
  client.post("/auth/signup", { name, emailID, password, role });

const saveGoogleUser = (name, emailID, password, role = "user") =>
  client.post("/auth/saveGoogle", { name, emailID, password, role });

export default {
  login,
  register,
  saveGoogleUser,
};

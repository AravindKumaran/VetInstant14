import client from './client'

const login = (emailID, password) =>
  client.post('/auth/login', { emailID, password })

const register = (name, emailID, password, role = 'user') =>
  client.post('/auth/signup', { name, emailID, password, role })

const saveGoogleUser = (name, emailID, password, role = 'user') =>
  client.post('/auth/saveGoogle', { name, emailID, password, role })

const sendForgotPasswordMail = (emailID) =>
  client.post('/auth/forgotpassword', { emailID, forMobilee: true })

const resetPassword = (code, password) =>
  client.post('/auth/resetpasswordmobile', { code, password })

export default {
  login,
  register,
  saveGoogleUser,
  sendForgotPasswordMail,
  resetPassword,
}

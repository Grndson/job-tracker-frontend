import api from './axios'

export const updateProfile  = (data) => api.patch('/user/profile', data)
export const updatePassword = (data) => api.patch('/user/password', data)
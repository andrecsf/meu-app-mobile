import axios from 'axios'

const api = axios.create({
  baseURL: 'https://habit-tracker-backend-idux.onrender.com'
})

export default api
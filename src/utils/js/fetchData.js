import axios from 'axios'

const api = axios.create({
  // pon aca el link de la api
  baseURL: 'https://705rckng-3001.use2.devtunnels.ms/',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const fetchData = async ({ method, url, data = null }) => {
  try {
    const response = await api({
      method,
      url,
      data
    })
    return response.data
  } catch (error) {
    console.error(`${method.toUpperCase()} request to ${url} failed:`, error)
    throw error
  }
}
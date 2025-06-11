// src/services/api/productService.js
import api from './api'


 const getNetflixUpdateFamily = async () => {
  const response = await api.get('TempMail/get-netflix-update-family')
  return response.data
}

export default getNetflixUpdateFamily;
// src/services/api/productService.js
import api from './api'


 export const getNetflixUpdateFamily = async () => {
  const response = await api.get('TempMail/get-netflix-update-family')
  return response.data
}
 export const getEmailContentByEmailId = async (emailId) => {
  const response = await api.post('TempMail/get-mail-content',{
    emailId : String(emailId)
  })
  return response.data
}


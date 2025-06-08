import axiosInstance from './api';
import { API_ENDPOINTS } from '../../utils/apiEndpoint';

export const netflixService = {
  getTempEmail: async (email, typeMailRequest) => {
    const response = await axiosInstance.get(API_ENDPOINTS.NETFLIX.GET_TEMP_EMAIL, {
      params: { Email: email, TypeMailRequest: typeMailRequest },
    });
    return response.data;
  },
};
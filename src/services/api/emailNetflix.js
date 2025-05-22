import api from './api';

export const getTemporaryNetflixMail = (email, typemailrequest) => {
  return api.post('/netflix/get-email-temporary-watch-netflix', { email, typemailrequest });
};
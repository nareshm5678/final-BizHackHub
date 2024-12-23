import axios from 'axios';

export const saveGameTime = async (timeTaken, username) => {
  const response = await axios.post('http://localhost:5000/api/save-time', {
    user: username,
    timeTaken,
  });
  return response.data;
};

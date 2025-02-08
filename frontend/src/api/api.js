import axios from "axios";

const API_URL = "http://localhost:5000"; // Update this if your backend URL changes

export const createSession = async () => {
  const response = await axios.post(`${API_URL}/create-session`);
  return response.data;
};

export const getSession = async (sessionCode) => {
  const response = await axios.get(`${API_URL}/session/${sessionCode}`);
  return response.data;
};

export const createPoll = async (sessionCode, pollData) => {
  const response = await axios.post(`${API_URL}/session/${sessionCode}/create-poll`, pollData);
  return response.data;
};

export const voteOnPoll = async (pollId, option) => {
  const response = await axios.post(`${API_URL}/poll/${pollId}/vote`, { option });
  return response.data;
};

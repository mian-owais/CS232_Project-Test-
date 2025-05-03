import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get the authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create an axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getPDFDocuments = async () => {
  const response = await api.get('/documents');
  return response.data.map((doc) => ({
    ...doc,
    url: doc.url.startsWith('http') ? doc.url : `${API_URL}${doc.url}`
  }));
};

export const deletePDFDocument = async (id) => {
  await api.delete(`/documents/${id}`);
};

export const convertPDFToAudio = async (id) => {
  const response = await api.post(`/documents/process/${id}`);
  return response.data;
}; 
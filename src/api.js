import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// 🔹 Adiciona o token de acesso (se existir) em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // <-- ajustado
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Intercepta respostas com erro 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refreshToken'); // <-- ajustado
        if (!refresh) {
          throw new Error('Sem token de refresh');
        }

        // Pede novo token ao backend
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh,
        });

        // Atualiza o token no localStorage
        localStorage.setItem('token', response.data.access);

        // Atualiza o header Authorization e refaz a requisição original
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Erro ao renovar o token:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // força logout
      }
    }

    return Promise.reject(error);
  }
);

export default api;

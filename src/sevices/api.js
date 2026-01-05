import axios from 'axios';

const API_URL = 'https://platense-backend.vercel.app/api/members'

const api = {
  getJugadoras: async (categoria = null) => {
    let url = API_URL;
    if (categoria && categoria !== 'Todas') {
      url += `?category=${categoria}`;
    }
    
    const response = await axios.get(url);
    return response.data.data.members;
  },

  crearJugadora: async (jugadora) => {
    const response = await axios.post(API_URL, jugadora);
    return response.data.data.member;
  },

  eliminarJugadora: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data; 
  }
}

export default api
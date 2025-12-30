import axios from 'axios';
import ENVIRONMENT from '../config/environment.js';

const api = {
  getJugadoras: async (categoria = null) => {
    let url = ENVIRONMENT.API_URL
    if (categoria && categoria !== 'Todas') {
      url += `?category=${categoria}`;
    }
    
    const response = await axios.get(url);
    return response.data.data.members;
  },

  crearJugadora: async (jugadora) => {
    const response = await axios.post(ENVIRONMENT.API_URL, jugadora);
    return response.data.data.member;
  }
};

export default api
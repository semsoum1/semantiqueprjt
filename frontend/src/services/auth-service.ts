import axios from '../lib/axios';
import { AUTH_URLS } from '@/src/constants';
import {LoginResponse, RegisterData} from "@/src/interfaces/auth";

const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      AUTH_URLS.LOGIN, 
      {
        username,
        password,
      },
    );

    return response.data;
  },

  register: async (data: RegisterData): Promise<any> => {
    const response = await axios.post(AUTH_URLS.REGISTER, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axios.post(AUTH_URLS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};

export default authService;

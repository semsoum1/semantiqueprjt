import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '@/src/services/auth-service';

interface AuthContextType {
    userToken: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType,
);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) setUserToken(token);
            } catch (error) {
                console.error('Failed to load token:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await authService.login(username, password);
            if (response?.token) {
                console.log("Auth token: ", response.token, "")
                await AsyncStorage.setItem('token', response.token);
                setUserToken(response.token);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string , password: string) => {
        try {
            setIsLoading(true);
            await authService.register({ username , password });
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            await AsyncStorage.removeItem('token');
            setUserToken(null);
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

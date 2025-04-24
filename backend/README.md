# Spring Boot and React Native Integration

This project consists of a Spring Boot backend and a React Native frontend. This README provides instructions on how to connect the frontend with the backend.

## Project Structure

- `backend/`: Spring Boot backend
- `frontend/`: React Native frontend

## Backend

The backend is built with Spring Boot and provides the following features:

- User authentication (register, login)
- Book management (create, read, update, delete)
- Book borrowing and returning

### API Endpoints

The backend exposes an `/api-config` endpoint that returns all available API endpoints. This can be used by the frontend to dynamically configure API calls.

## Frontend

The frontend is built with React Native and should implement the following features:

- User authentication (register, login)
- Book listing and details
- Book borrowing and returning

## Connecting Frontend with Backend

### 1. API Service

Create an API service in the frontend to handle communication with the backend:

```javascript
// frontend/src/services/api.js
import axios from 'axios';

// Base URL of your backend
const API_BASE_URL = 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch API configuration from backend
export const fetchApiConfig = async () => {
  try {
    const response = await api.get('/api-config');
    return response.data;
  } catch (error) {
    console.error('Error fetching API config:', error);
    throw error;
  }
};

// Auth services
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data;
  },
  register: async (username, password) => {
    const response = await api.post('/api/auth/register', { username, password });
    return response.data;
  },
};

// Book services
export const bookService = {
  getBooks: async () => {
    const response = await api.get('/api/livres');
    return response.data;
  },
  borrowBook: async (bookId) => {
    const response = await api.post(`/api/livres/emprunt/${bookId}`);
    return response.data;
  },
  returnBook: async (bookId) => {
    const response = await api.post(`/api/livres/retour/${bookId}`);
    return response.data;
  },
  createBook: async (book) => {
    const response = await api.post('/api/livres', book);
    return response.data;
  },
  updateBook: async (bookId, book) => {
    const response = await api.put(`/api/livres/${bookId}`, book);
    return response.data;
  },
  deleteBook: async (bookId) => {
    const response = await api.delete(`/api/livres/${bookId}`);
    return response.data;
  },
};

export default api;
```

### 2. Authentication Context

Create an authentication context to manage user authentication state:

```javascript
// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to validate the token here
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await authService.login(username, password);
      const { token } = response;
      localStorage.setItem('token', token);
      setUser({ token });
      setError(null);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password) => {
    try {
      setLoading(true);
      const response = await authService.register(username, password);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 3. Book Context

Create a book context to manage book state:

```javascript
// frontend/src/context/BookContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { bookService } from '../services/api';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks();
      setBooks(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const borrowBook = async (bookId) => {
    try {
      await bookService.borrowBook(bookId);
      fetchBooks(); // Refresh books after borrowing
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const returnBook = async (bookId) => {
    try {
      await bookService.returnBook(bookId);
      fetchBooks(); // Refresh books after returning
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const createBook = async (book) => {
    try {
      await bookService.createBook(book);
      fetchBooks(); // Refresh books after creating
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateBook = async (bookId, book) => {
    try {
      await bookService.updateBook(bookId, book);
      fetchBooks(); // Refresh books after updating
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await bookService.deleteBook(bookId);
      fetchBooks(); // Refresh books after deleting
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        error,
        fetchBooks,
        borrowBook,
        returnBook,
        createBook,
        updateBook,
        deleteBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => useContext(BookContext);
```

### 4. App Component

Update the App component to use the providers:

```javascript
// frontend/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { BookProvider } from './src/context/BookContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <BookProvider>
          <AppNavigator />
        </BookProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
```

## Running the Application

1. Start the backend:
   ```
   cd backend
   ./mvnw spring-boot:run
   ```

2. Start the frontend:
   ```
   cd frontend
   npm start
   ```

## Notes

- Make sure to update the `API_BASE_URL` in the API service to match your backend URL.
- For mobile development, you might need to use the IP address of your machine instead of `localhost`.
- For production, you should configure environment variables for the API URL.
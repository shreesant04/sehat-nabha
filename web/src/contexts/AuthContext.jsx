import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../config/firebase';
import axios from 'axios';
import toast from 'react-hot-toast';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
axios.defaults.baseURL = API_BASE_URL;

// Auth Context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, userProfile: null, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    userProfile: null,
    loading: true,
    error: null
  });

  // Set up auth token interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      async (config) => {
        if (state.user) {
          try {
            const token = await state.user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          } catch (error) {
            console.error('Error getting auth token:', error);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, [state.user]);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        // Fetch user profile
        try {
          const token = await user.getIdToken();
          const response = await axios.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch({ type: 'SET_USER_PROFILE', payload: response.data.user });
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (email, password, userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Register user profile on server
      const token = await userCredential.user.getIdToken();
      await axios.post('/auth/register', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Account created successfully!');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
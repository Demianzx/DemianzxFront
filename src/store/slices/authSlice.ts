import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UsersClient, LoginRequest, RegisterRequest, RefreshRequest  } from '../../services/api/web-api-client';
import apiClient from '../../services/api/apiClient';
import { jwtDecode } from 'jwt-decode';

// Interface para los datos decodificados del token JWT
interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  exp: number;
  name?: string;
}

interface AuthState {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  } | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

// Inicializar el estado con datos del localStorage si existen
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null
};

// Si ya hay un token, intentamos inicializar el usuario
if (initialState.token) {
  try {
    const decodedToken = jwtDecode<JwtPayload>(initialState.token);
    // Verificar si el token no ha expirado
    if (decodedToken.exp * 1000 > Date.now()) {
      initialState.user = {
        id: decodedToken.sub,
        email: decodedToken.email,
        role: decodedToken.role,
        name: decodedToken.name
      };
      initialState.isAuthenticated = true;
    } else {
      // Si el token ha expirado, limpiamos el localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      initialState.token = null;
      initialState.refreshToken = null;
    }
  } catch (e) {
    // Si hay algún error al decodificar el token, limpiamos el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    initialState.token = null;
    initialState.refreshToken = null;
  }
}

const usersClient = new UsersClient('', apiClient);

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const loginRequest = new LoginRequest();
      loginRequest.email = credentials.email;
      loginRequest.password = credentials.password;
      
      const response = await usersClient.postApiUsersLogin(false, false, loginRequest);
      
      // Guardar tokens en localStorage
      localStorage.setItem('token', response.accessToken || '');
      localStorage.setItem('refreshToken', response.refreshToken || '');
      
      // Decodificar token para obtener información del usuario
      const decodedToken = jwtDecode<JwtPayload>(response.accessToken || '');
      
      return {
        token: response.accessToken,
        refreshToken: response.refreshToken,
        user: {
          id: decodedToken.sub,
          email: decodedToken.email,
          role: decodedToken.role,
          name: decodedToken.name
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const registerRequest = new RegisterRequest();
      registerRequest.email = userData.email;
      registerRequest.password = userData.password;
      
      await usersClient.postApiUsersRegister(registerRequest);
      
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
      try {
        const state = getState() as { auth: AuthState };
        const refreshToken = state.auth.refreshToken;
        
        if (!refreshToken) {
          return rejectWithValue('No refresh token available');
        }
        
        // Crear una instancia adecuada de RefreshRequest
        const refreshRequest = RefreshRequest.fromJS({
          refreshToken: refreshToken
        });
        
        const response = await usersClient.postApiUsersRefresh(refreshRequest);
        
        // Guardar nuevos tokens en localStorage
        localStorage.setItem('token', response.accessToken || '');
        localStorage.setItem('refreshToken', response.refreshToken || '');
        
        // Decodificar token para obtener información del usuario
        const decodedToken = jwtDecode<JwtPayload>(response.accessToken || '');
        
        return {
          token: response.accessToken,
          refreshToken: response.refreshToken,
          user: {
            id: decodedToken.sub,
            email: decodedToken.email,
            role: decodedToken.role,
            name: decodedToken.name
          }
        };
      } catch (error) {
        // Limpiar tokens si falla la actualización
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('Unknown error occurred');
      }
    }
  );

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Eliminar tokens del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Restablecer el estado
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Manejar login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refreshToken || null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Login failed';
      })

    // Manejar register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        // No cambiamos el estado de autenticación, ya que el usuario aún debe iniciar sesión
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Registration failed';
      })

    // Manejar refreshToken
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refreshToken || null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Token refresh failed';
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
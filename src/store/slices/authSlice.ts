import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UsersClient, LoginRequest, RegisterRequest, RefreshRequest, RegisterUserCommand  } from '../../services/api/web-api-client';
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
      
      // Verificar que tenemos un token válido antes de procesarlo
      if (!response.accessToken) {
        return rejectWithValue('No access token received from server');
      }
      
      // Guardar tokens en localStorage
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken || '');
      
      try {
        // Decodificar token para obtener información del usuario
        const decodedToken = jwtDecode<JwtPayload>(response.accessToken);
        
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
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
        
        // Si no podemos decodificar el token, aún podemos devolver la información básica
        return {
          token: response.accessToken,
          refreshToken: response.refreshToken,
          user: {
            id: 'unknown',
            email: credentials.email,
            role: undefined,
            name: undefined
          }
        };
      }
    } catch (error: any) {
      // Manejo detallado del error
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400 && data && data.title) {
          return rejectWithValue(data.title);
        }
      }
      
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Login failed. Please try again.');
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
    } catch (error: any) {
      // Manejo más detallado de errores
      if (error.response && error.response.data) {
        // Si tenemos la respuesta del error, la devolvemos con más detalle
        const errorData = error.response.data;
        
        if (errorData.errors) {
          // Errores de validación
          let errorMessage = "";
          
          if (errorData.errors.DuplicateUserName) {
            errorMessage = errorData.errors.DuplicateUserName[0];
          } else if (errorData.errors.PasswordRequiresNonAlphanumeric) {
            errorMessage = "Password must contain at least one special character.";
          } else if (errorData.errors.PasswordRequiresDigit) {
            errorMessage = "Password must contain at least one digit.";
          } else if (errorData.errors.PasswordRequiresUpper) {
            errorMessage = "Password must contain at least one uppercase letter.";
          } else {
            // Si hay otros errores, los concatenamos
            Object.values(errorData.errors).forEach((errorArray: any) => {
              errorMessage += errorArray.join(', ') + ' ';
            });
          }
          
          return rejectWithValue(errorMessage.trim());
        }
        
        // Si hay un mensaje de error general
        if (errorData.title) {
          return rejectWithValue(errorData.title);
        }
      }
      
      // Error genérico
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { userName: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const registerUserCommand = new RegisterUserCommand();
      registerUserCommand.userName = userData.userName;
      registerUserCommand.email = userData.email;
      registerUserCommand.password = userData.password;
      
      await usersClient.registerUser(registerUserCommand);
      
      return { success: true };
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (errorData.errors) {
          let errorMessage = "";
          
          if (errorData.errors.DuplicateUserName) {
            errorMessage = errorData.errors.DuplicateUserName[0];
          } else if (errorData.errors.PasswordRequiresNonAlphanumeric) {
            errorMessage = "Password must contain at least one special character.";
          } else if (errorData.errors.PasswordRequiresDigit) {
            errorMessage = "Password must contain at least one digit.";
          } else if (errorData.errors.PasswordRequiresUpper) {
            errorMessage = "Password must contain at least one uppercase letter.";
          } else {
            Object.values(errorData.errors).forEach((errorArray: any) => {
              errorMessage += errorArray.join(', ') + ' ';
            });
          }
          
          return rejectWithValue(errorMessage.trim());
        }
        
        if (errorData.title) {
          return rejectWithValue(errorData.title);
        }
      }
      
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Registration failed. Please try again.');
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
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // No cambiamos el estado de autenticación, ya que el usuario aún debe iniciar sesión
      })
      .addCase(registerUser.rejected, (state, action) => {
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
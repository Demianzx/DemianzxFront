import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulación de API call
      console.log('Logging in with:', email, password);
      
      // Simular un delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simular una autenticación exitosa (esto sería reemplazado por una llamada a la API real)
      setUser({
        id: '1',
        email,
        name: email.split('@')[0],
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  
  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulación de API call
      console.log('Registering with:', email, password);
      
      // Simular un delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simular un registro exitoso (esto sería reemplazado por una llamada a la API real)
      setUser({
        id: '1',
        email,
        name: email.split('@')[0],
      });
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';

// Define types for state and actions
interface User {
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthAction {
  type: 'LOGIN' | 'LOGOUT';
  payload?: User;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | undefined>(undefined);

// Type children prop in AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload || null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const callPage = async () => {
    try {
      const res = await fetch('/home', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (res.status === 200 && data.user) {
        const { email } = data.user; // assuming user object contains email
        localStorage.setItem('email', email); // Store email if needed
        dispatch({ type: 'LOGIN', payload: { email } });
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    callPage();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): { state: AuthState; dispatch: React.Dispatch<AuthAction> } => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

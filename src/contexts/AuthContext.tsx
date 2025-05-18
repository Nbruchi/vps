
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if user is already logged in via JWT token in localStorage
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // In a real app, validate token and get user data from backend
          // For demo, we're mocking this with stored user data
          const userData = localStorage.getItem('userData');
          if (userData) {
            const user = JSON.parse(userData) as User;
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Token exists but no user data - logout
            localStorage.removeItem('token');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth error:', error);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Mock login function (in real app, would call API)
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Mock API call
      if (email === "admin@example.com" && password === "password123") {
        const mockUser: User = {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin"
        };
        
        // Mock JWT token
        const mockToken = "mock-jwt-token-for-admin";
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        
        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
        
        toast.success('Logged in as Admin');
      } else if (email === "user@example.com" && password === "password123") {
        const mockUser: User = {
          id: "2",
          name: "Regular User",
          email: "user@example.com",
          role: "user"
        };
        
        // Mock JWT token
        const mockToken = "mock-jwt-token-for-user";
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        
        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
        
        toast.success('Logged in successfully');
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  // Mock register function (in real app, would call API)
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Mock successful registration
      toast.success('Registration successful! Please log in.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    }
  };

  // Mock logout function
  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    toast.success('Logged out successfully');
  };

  // Mock update profile function
  const updateProfile = async (name: string, email: string): Promise<void> => {
    try {
      if (!authState.user) throw new Error("Not authenticated");
      
      const updatedUser = {
        ...authState.user,
        name,
        email
      };
      
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setAuthState({
        ...authState,
        user: updatedUser,
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Profile update failed');
      throw error;
    }
  };

  // Mock change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      // Mock API call
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Password change failed');
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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

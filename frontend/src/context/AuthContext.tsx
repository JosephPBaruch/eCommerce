import { randomUUID, UUID } from 'crypto';
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    ReactNode,
} from 'react';

interface AuthContextType {
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean; // To handle initial loading state
    error: string | null; // To store login errors
    login: (access: string) => void;
    logout: () => void;
    clearError: () => void; // Function to clear errors
    uid: string | null // userid
}

// Create the context with a default value (usually undefined or null)
// We assert a default value here to satisfy TypeScript initially.
// The provider will supply the actual implementation.
const AuthContext = createContext<AuthContextType>(undefined!);

interface AuthProviderProps {
    children: ReactNode;
}

// Mock Backend API function
function getUID(accessToken: string): string {
    return 'user1234';
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading
    const [error, setError] = useState<string | null>(null);

    // Check local storage on initial load
    useEffect(() => {
        try {
            const storedAccess = localStorage.getItem('access_token');
            if (storedAccess) {
                setAccessToken(storedAccess);
            }
        } catch (err) {
            console.error('Failed to read tokens from storage:', err);
            // Handle potential storage errors (e.g., storage disabled)
            setError('Could not access token storage.');
        } finally {
            setIsLoading(false); // Finished loading initial state
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    const login = (access: string) => {
        try {
            localStorage.setItem('access_token', access);
            setAccessToken(access);
            setError(null); // Clear any previous errors on successful login
            console.log('AuthContext: User logged in, tokens stored.');
        } catch (err) {
            console.error('Failed to save tokens to storage:', err);
            setError('Could not save session. Please try again.');
            // Clear state if storage fails
            setAccessToken(null);
            localStorage.removeItem('access_token');
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('access_token');
        } catch (err) {
            console.error('Failed to remove tokens from storage:', err);
            // Even if storage fails, clear the state
        } finally {
            setAccessToken(null);
            setError(null);
            console.log('AuthContext: User logged out, tokens cleared.');
        }
    };

    const clearError = () => {
        setError(null);
    };


    // Determine authentication status based on token presence
    const isAuthenticated = !!accessToken;
    // Get user id if authenticated
    const uid = isAuthenticated ? getUID(accessToken) : null;

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            accessToken,
            isAuthenticated,
            isLoading,
            error,
            login,
            logout,
            clearError,
            uid
        }),
        [accessToken, isAuthenticated, isLoading, error],
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

// Custom hook to easily consume the context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

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
    refreshToken: string | null; // Add refresh token
    isAuthenticated: boolean;
    isLoading: boolean; // To handle initial loading state
    error: string | null; // To store login errors
    login: (tokens: { access: string; refresh: string }) => void; // Accept both tokens
    logout: () => void;
    clearError: () => void; // Function to clear errors
    // uid: string | null // userid
}


// Create the context with a default value (usually undefined or null)
// We assert a default value here to satisfy TypeScript initially.
// The provider will supply the actual implementation.
const AuthContext = createContext<AuthContextType>(undefined!);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null); // Add state for refresh token
    const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading
    const [error, setError] = useState<string | null>(null);

    // Check local storage on initial load
    useEffect(() => {
        try {
            const storedAccess = localStorage.getItem('access_token');
            const storedRefresh = localStorage.getItem('refresh_token');
            if (storedAccess) {
                setAccessToken(storedAccess);
            }
            if (storedRefresh) {
                setRefreshToken(storedRefresh);
            }
        } catch (err) {
            console.error('Failed to read tokens from storage:', err);
            // Handle potential storage errors (e.g., storage disabled)
            setError('Could not access token storage.');
        } finally {
            setIsLoading(false); // Finished loading initial state
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Ensure this function signature matches the data structure passed from loginUser
    const login = ({ access, refresh }: { access: string; refresh: string }) => {
        try {
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh); // Make sure 'refresh' is provided
            setAccessToken(access);
            setRefreshToken(refresh);
            setError(null);
            console.log('AuthContext: User logged in, tokens stored.');
        } catch (err) {
            console.error('Failed to save tokens to storage:', err);
            setError('Could not save session. Please try again.');
            // Clear state if storage fails
            setAccessToken(null);
            setRefreshToken(null);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } catch (err) {
            console.error('Failed to remove tokens from storage:', err);
            // Even if storage fails, clear the state
        } finally {
            setAccessToken(null);
            setRefreshToken(null);
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
    // const uid = isAuthenticated ? getUID(accessToken) : null;

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            accessToken,
            refreshToken, // Include refresh token in context
            isAuthenticated,
            isLoading,
            error,
            login,
            logout,
            clearError,
            // uid
        }),
        [accessToken, refreshToken, isAuthenticated, isLoading, error],
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

import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import useAuth
import { CircularProgress, Box } from '@mui/material'; // For loading state

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Use context state

  // Show loading indicator while context is initializing
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect if not authenticated after loading is complete
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Render the protected element if authenticated
  return element;
};

export default ProtectedRoute;
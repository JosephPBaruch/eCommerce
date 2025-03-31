import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';

// Page Imports
import HomePage from './components/home/home';
import SignIn from './components/login/SignIn';
import SignUp from './components/login/SignUp';
import SellItemPage from './components/sell/sell'; 
import UserProfilePage from './components/user/UserProfilePage';
import OrderHistoryPage from './components/user/OrderHistory';
import OrderDetailsPage from './components/user/OrderDetail';
import ManageAddressesPage from './components/user/ManageAddress';
import UserListingsPage from './components/user/UserListingsPage';
import ViewListingPage from './components/listing/ViewListingPage';
import PublicProfilePage from './components/user/PublicProfilePage';
import EditListingPage from './components/listing/EditListingPage';

// Auth Imports
import ProtectedRoute from './ProtectedRoute'; // Your protected route component
import { AuthProvider } from './context/AuthContext'; // Import the provider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="user/:username" element={<PublicProfilePage />} />
            <Route path="sell" element={<ProtectedRoute element={<SellItemPage />} />} />
            <Route path="listing/:listingId" element={<ViewListingPage />} />


            {/* Protected Routes */}
            <Route path="profile" element={<ProtectedRoute element={<UserProfilePage />} />} />
            <Route path="profile/orders" element={<ProtectedRoute element={<OrderHistoryPage />} />} />
            <Route path="profile/orders/:orderId" element={<ProtectedRoute element={<OrderDetailsPage />} />} />
            <Route path="profile/addresses" element={<ProtectedRoute element={<ManageAddressesPage />} />} />
            <Route path="profile/listings" element={<ProtectedRoute element={<UserListingsPage />} />} />
            <Route path="listing/:listingId/edit" element={<ProtectedRoute element={<EditListingPage />} />} />


            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </Router>
      </AuthProvider>
    </StyledEngineProvider>
  </StrictMode>,
)

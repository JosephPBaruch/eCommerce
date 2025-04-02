import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Avatar,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Button,
    CircularProgress,
    ListItemAvatar,
    Alert,
    Chip,
    IconButton,

} from '@mui/material';
import {
    Email,
    CalendarToday,
    ShoppingBag,
    LocationOn,
    Settings,
    Edit,
    Home,
    Business,
} from '@mui/icons-material';
import { NavLink } from "react-router";
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer';
import { UserProfileData, OrderSummary} from '../../types/userProfile';
import { UserListingSummary } from '../../types/listing'; // <-- Import listing type
import {
    Storefront as StorefrontIcon, // <-- Icon for listings section
    Inventory as InventoryIcon, // <-- Fallback icon for listing image
} from '@mui/icons-material';
import { fetchUserProfileData } from '../../api/UserProfile';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/GridLegacy';


const UserProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // <-- Hook for navigation

    // TODO: Replace 'user123' with the actual logged-in user ID from auth context/state
    const userId = 'user123';

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchUserProfileData(localStorage.getItem('access_token') || "", userId);
                setUserData(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An unknown error occurred',
                );
                console.error('Error fetching user profile:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]); // Re-fetch if userId changes (though likely stable for a profile page)

    // const formatDate = (dateString: string): string => {
    //     return new Date(dateString).toLocaleDateString(undefined, {
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric',
    //     });
    // };

    // const formatShortDate = (dateString: string): string => {
    //     return new Date(dateString).toLocaleDateString(undefined, {
    //       month: 'short',
    //       day: 'numeric',
    //     });
    //   };

    // const formatCurrency = (amount: number): string => {
    //     return new Intl.NumberFormat(undefined, {
    //         style: 'currency',
    //         currency: 'USD', // Adjust currency as needed
    //     }).format(amount);
    // };

    // // Combined function for status chip colors
    // const getStatusChipColor = (
    //     status: OrderSummary['status'] | UserListingSummary['status'],
    // ):
    //     | 'default'
    //     | 'primary'
    //     | 'secondary'
    //     | 'error'
    //     | 'info'
    //     | 'success'
    //     | 'warning' => {
    //     switch (status) {
    //         // Order Statuses
    //         case 'Delivered': return 'success';
    //         case 'Shipped': return 'info';
    //         case 'Processing': return 'warning';
    //         case 'Pending': return 'secondary';
    //         case 'Cancelled': return 'error';
    //         // Listing Statuses
    //         case 'Active': return 'success';
    //         case 'Sold': return 'secondary';
    //         case 'Inactive': return 'default';
    //         case 'Draft': return 'warning';
    //         default: return 'default';
    //     }
    // };
    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 3 }}>
                <Alert severity="error">
                    Error loading profile: {error}. Please try again later.
                </Alert>
            </Container>
        );
    }

    if (!userData) {
        // Should ideally not happen if loading is false and no error, but good practice
        return (
            <Container sx={{ mt: 3 }}>
                <Alert severity="warning">User data not found.</Alert>
            </Container>
        );
    }

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '50%' }}>
                <Container maxWidth="lg" sx={{ mt: 20, mb: 15 }}>
                    <Grid container spacing={3}>
                        {/* Profile Header Section */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    alt={`${userData.firstName} ${userData.lastName}`}
                                    src={userData.avatarUrl || undefined} // Use undefined if no URL
                                    sx={{ width: 100, height: 100, mb: 2 }}
                                >
                                    {/* Fallback Initials */}
                                    {!userData.avatarUrl && `${userData.firstName[0]}${userData.lastName[0]}`}
                                </Avatar>
                                {/* <Typography variant="h5" gutterBottom>
                                    {userData.firstName} {userData.lastName}
                                </Typography>
                                {userData.username && (
                                    <Typography color="text.secondary" gutterBottom>
                                        @{userData.username}
                                    </Typography>
                                )} */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Email fontSize="small" sx={{ mr: 1 }} color="action" />
                                    <Typography variant="body2">{userData.email}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={() => navigate('/profile/orders')} // Navigate to full listings page
                                    >
                                        View All Orders
                                    </Button>
                                </Box>
                                {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={() => navigate('profile/addresses')} // Navigate to full listings page
                                    >
                                       View Addresses
                                    </Button>
                                </Box> */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={() => navigate('/profile/listings')} // Navigate to full listings page
                                    >
                                        View All Listings
                                    </Button>
                                </Box>
                                {/* <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <CalendarToday fontSize="small" sx={{ mr: 1 }} color="action" />
                                    <Typography variant="body2">
                                        Joined: {formatDate(userData.joinDate)}
                                    </Typography>
                                </Box> */}
                                {/* <Button
                                    variant="outlined"
                                    startIcon={<Edit />}
                                    sx={{ mt: 3 }}
                                    onClick={() => alert('Navigate to Edit Profile page')} // Replace with actual navigation
                                >
                                    Edit Profile
                                </Button> */}
                            </Paper>
                        </Grid>

                        {/* Main Content Section */}
                        {/* <Grid item xs={12} md={8}> */}
                            {/* Recent Orders Section */}
                            {/* <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ShoppingBag sx={{ mr: 1 }} /> Recent Orders
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {userData.recentOrders.length > 0 ? (
                                    <List dense>
                                        {userData.recentOrders.map((order) => (
                                            <ListItem
                                                key={order.id}
                                                secondaryAction={
                                                    <Chip
                                                        label={order.status}
                                                        color={getStatusChipColor(order.status)}
                                                        size="small"
                                                    />
                                                }
                                            >
                                                <ListItemText
                                                    primary={`Order #${order.orderNumber}`}
                                                    secondary={`${formatDate(order.date)} - ${formatCurrency(order.total)}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 2 }}>
                                        No recent orders found.
                                    </Typography>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <NavLink to='/profile/orders' end>View All Orders</NavLink>
                                </Box>
                            </Paper> */}
                            {/* Listings Section */}
                            {/* <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <StorefrontIcon sx={{ mr: 1 }} /> Your Listings
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {userData.recentListings && userData.recentListings.length > 0 ? (
                                    <List dense>
                                        {userData.recentListings.map((listing) => (
                                            <ListItem key={listing.id} alignItems="flex-start">
                                                <ListItemAvatar sx={{ mt: 0.5 }}>
                                                    <Avatar
                                                        variant="rounded"
                                                        src={listing.imageUrl || undefined}
                                                        alt={listing.title}
                                                        sx={{ width: 56, height: 56, bgcolor: 'grey.100',mr:1.5 }}
                                                    >
                                                        <InventoryIcon fontSize="small" />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={listing.title}
                                                    secondary={
                                                        <>
                                                            <Typography component="span" variant="body2" color="text.primary" fontWeight="medium">
                                                                {formatCurrency(listing.price)}
                                                            </Typography>
                                                            {' - '}
                                                            <Chip
                                                                label={listing.status}
                                                                color={getStatusChipColor(listing.status)}
                                                                size="small"
                                                                sx={{ height: 'auto', mr: 0.5, '& .MuiChip-label': { py: 0.2, px: 0.8 } }} // Compact chip
                                                            />
                                                            {' - '} Listed: {formatShortDate(listing.dateListed)}
                                                        </>
                                                    }
                                                /> */}
                                                {/* Optional: Add a small view/edit button here if needed */}
                                                {/* <ListItemSecondaryAction>...</ListItemSecondaryAction> */}
                                            {/* </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 2 }}>
                                        You have no active listings.
                                        <Button size="small" sx={{ ml: 1 }} onClick={() => navigate('/sell')}>List an Item</Button>
                                    </Typography>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={() => navigate('/profile/listings')} // Navigate to full listings page
                                    >
                                        View All Listings
                                    </Button>
                                </Box>
                            </Paper> */}
                            {/* Listings Section */}

                            {/* Addresses Section */}
                            {/* <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOn sx={{ mr: 1 }} /> Saved Addresses
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {userData.addresses.length > 0 ? (
                                    <List dense>
                                        {userData.addresses.map((address) => (
                                            <ListItem key={address.id}>
                                                <ListItemText
                                                    primary={`${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`}
                                                    secondary={
                                                        <>
                                                            {address.isDefaultShipping && (
                                                                <Chip icon={<Home fontSize="small" />} label="Default Shipping" size="small" sx={{mt: 1, mr: 1 }} />
                                                            )}
                                                            {address.isDefaultBilling && (
                                                                <Chip icon={<Business fontSize="small" />} label="Default Billing" size="small" sx={{mt: 1, mr: 1 }}/>
                                                            )}
                                                        </>
                                                    }
                                                />
                                                <IconButton edge="end" aria-label="edit address" size="small" onClick={() => alert(`Edit address ${address.id}`)}>
                                                    <Edit fontSize="inherit" />
                                                </IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 2 }}>
                                        No saved addresses found.
                                    </Typography>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <NavLink to='/profile/addresses' end>Manage Addresses</NavLink>
                                </Box>
                            </Paper> */}

                            {/* Settings Section (Example) */}
                            {/* <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Settings sx={{ mr: 1 }} /> Account Settings
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <List dense>
                                    <ListItemButton onClick={() => alert('Navigate to Change Password page')}>
                                        <ListItemText primary="Change Password" />
                                    </ListItemButton>
                                </List>
                            </Paper> */}
                        {/* </Grid> */}
                    </Grid>
                </Container>
                <Footer />
            </Box>
        </AppTheme>

    );
};

export default UserProfilePage;
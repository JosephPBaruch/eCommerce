import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Email } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer';
import { UserProfileData } from '../../types/userProfile';
import { fetchUserProfileData } from '../../api/UserProfile';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/GridLegacy';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const UserProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { accessToken } = useAuth();


    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchUserProfileData(accessToken);
                setUserData(data);
            } catch (err) {
                console.error('Error fetching user profile in UserProfilePage:', err);
                if (err instanceof Error && err.message === 'Unauthorized') {
                    navigate('/signin');
                } else {
                    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                    setError(errorMessage);
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

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
                <Container maxWidth="lg" sx={{ mt: 20, mb: 15, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Grid container spacing={3} justifyContent="center" alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    alt={`${userData.email} `}
                                    sx={{ width: 100, height: 100, mb: 2 }}
                                >
                                    {!userData.email && `${userData.email}${userData.email}`}
                                </Avatar>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Email fontSize="small" sx={{ mr: 1 }} color="action" />
                                    <Typography variant="body2">{userData.email}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mt: 2 }}> {/* Adjusted layout */}
                                    <Button
                                        size="small"
                                        onClick={() => navigate('/profile/orders')}
                                    >
                                        View Orders
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => navigate('/profile/listings')}
                                    >
                                        View Listings
                                    </Button>
                                </Box>

                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
                <Footer />
            </Box>
        </AppTheme>
    );
};

export default UserProfilePage;
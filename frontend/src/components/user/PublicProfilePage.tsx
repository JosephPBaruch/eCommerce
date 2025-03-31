import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Divider,
  Card, // Use Card for listing display
  Chip,
  CardActionArea, // Make listing card clickable
  CardMedia,
  CardContent,
  Tooltip,
} from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  LocationOn as LocationOnIcon,
  Storefront as StorefrontIcon, // Icon for listings section
  Inventory as InventoryIcon, // Fallback for listing image
  SentimentSatisfiedAlt as RatingIcon, // Example for rating
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Import shared components & context
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer'; 
import Grid from '@mui/material/GridLegacy';

// Import types
import { PublicUserProfileData } from '../../types/userProfile';
import { fetchPublicUserProfile } from '../../api/UserProfile';

const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>(); // Get username from URL
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<PublicUserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError('Username is missing in the URL.');
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPublicUserProfile(username);
        if (data) {
          setProfileData(data);
        } else {
          setError(`Profile not found for user "${username}".`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile.');
        console.error('Error fetching public profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]); // Re-fetch if username changes

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      // day: 'numeric', // Maybe omit day for join date
    });
  };

   const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD', // Adjust currency as needed
    }).format(amount);
  };

  // Estimate AppBar height
  const appBarHeight = 64;
  const appBarMarginTop = 0;

  // --- Render Logic ---

  if (loading) {
    return (
       <AppTheme>
         <CssBaseline enableColorScheme />
         <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
           <AppAppBar />
           <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, pb: 6 }}>
             <CircularProgress />
           </Container>
           <Footer />
         </Box>
       </AppTheme>
    );
  }

  if (error) {
    return (
       <AppTheme>
         <CssBaseline enableColorScheme />
         <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
           <AppAppBar />
           <Container component="main" maxWidth="md" sx={{ pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, pb: 6, flexGrow: 1 }}>
             <Alert severity="error" action={
                <Button color="inherit" size="small" onClick={() => navigate('/')}> {/* Go Home */}
                    Go Home
                </Button>
             }>
                {error}
             </Alert>
           </Container>
           <Footer />
         </Box>
       </AppTheme>
    );
  }

  if (!profileData) {
    // Should be covered by error state if API returns null
    return (
       <AppTheme>
         <CssBaseline enableColorScheme />
         <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
           <AppAppBar />
            <Container component="main" maxWidth="md" sx={{ pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, pb: 6, flexGrow: 1 }}>
                <Alert severity="warning">Profile data could not be loaded.</Alert>
            </Container>
           <Footer />
         </Box>
       </AppTheme>
    );
  }

  // --- Main Content Render ---
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppAppBar />

        <Container
          component="main"
          maxWidth="lg"
          sx={{
            pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`,
            pb: 6,
            flexGrow: 1,
          }}
        >
           <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
              Back
           </Button>

          <Grid container spacing={4}>
            {/* Left Column: User Info */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: 'sticky', top: `${(appBarHeight + appBarMarginTop) / 16 + 2}rem` }}> {/* Sticky position */}
                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Avatar
                       src={profileData.avatarUrl || undefined}
                       alt={profileData.username}
                       sx={{ width: 120, height: 120, mb: 2 }}
                    >
                       {/* Fallback Initials */}
                       {!profileData.avatarUrl && profileData.username[0]?.toUpperCase()}
                    </Avatar>
                    <Typography variant="h5" component="h1" gutterBottom>
                       {profileData.username}
                    </Typography>

                    {/* Optional: Rating/Sales */}
                    {profileData.positiveFeedbackPercent !== undefined && (
                       <Tooltip title={`${profileData.numSales || 0} Sales`} placement="bottom">
                          <Chip
                             icon={<RatingIcon />}
                             label={`${profileData.positiveFeedbackPercent}% Positive Feedback`}
                             size="small"
                             color={profileData.positiveFeedbackPercent >= 95 ? "success" : profileData.positiveFeedbackPercent >= 80 ? "warning" : "default"}
                             variant="outlined"
                             sx={{ mb: 1 }}
                          />
                       </Tooltip>
                    )}

                    {/* Optional: Location */}
                    {profileData.location && (
                       <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon fontSize="inherit" sx={{ mr: 0.5 }}/> {profileData.location}
                       </Typography>
                    )}

                    {/* Join Date */}
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                       <CalendarTodayIcon fontSize="inherit" sx={{ mr: 0.5 }}/> Member since {formatDate(profileData.joinDate)}
                    </Typography>

                    <Divider sx={{ width: '100%', my: 1 }}/>

                    {/* Optional: Bio */}
                    {profileData.bio && (
                       <Typography variant="body2" sx={{ mt: 1 }}>
                          {profileData.bio}
                       </Typography>
                    )}

                    {/* Optional: Contact Button */}
                    {/* <Button variant="outlined" size="small" sx={{ mt: 2 }}>Contact Seller</Button> */}
                 </Box>
              </Paper>
            </Grid>

            {/* Right Column: User's Listings */}
            <Grid item xs={12} md={8}>
               <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <StorefrontIcon sx={{ mr: 1 }} /> Items for Sale by {profileData.username}
               </Typography>
               <Divider sx={{ mb: 3 }}/>

               {profileData.activeListings.length > 0 ? (
                  <Grid container spacing={2}>
                     {profileData.activeListings.map((listing) => (
                        <Grid item key={listing.id} xs={12} sm={6} md={6} lg={4}> {/* Adjust grid sizing */}
                           <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                              <CardActionArea onClick={() => navigate(`/listing/${listing.id}`)}>
                                 <CardMedia
                                    component="img"
                                    height="160" // Fixed height for consistency
                                    image={listing.imageUrl || '/path/to/placeholder.png'} // Use placeholder
                                    alt={listing.title}
                                    sx={{ objectFit: 'cover', bgcolor: 'grey.200' }} // Cover ensures image fills space
                                 />
                                 <CardContent sx={{ flexGrow: 1 }}> {/* Allow content to grow */}
                                    <Typography gutterBottom variant="body1" component="div" noWrap> {/* Prevent long titles wrapping */}
                                       {listing.title}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                       {formatCurrency(listing.price)}
                                    </Typography>
                                 </CardContent>
                              </CardActionArea>
                           </Card>
                        </Grid>
                     ))}
                  </Grid>
               ) : (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                     <InventoryIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                     <Typography color="text.secondary">
                        {profileData.username} has no active listings right now.
                     </Typography>
                  </Paper>
               )}
               {/* Optional: Add "View All" button if listings are paginated */}
            </Grid>
          </Grid>
        </Container>

        <Footer />
      </Box>
    </AppTheme>
  );
};

export default PublicProfilePage;

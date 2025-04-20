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
  Chip,
  Avatar,
  Divider,
  Link as MuiLink, // For external links or seller profile link
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';

import {
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Storefront as StorefrontIcon, // For seller info
  Category as CategoryIcon,
  CheckCircleOutline as ConditionIcon, // Example icon for condition
  InfoOutlined as InfoIcon, // For status
} from '@mui/icons-material';

// Import shared components & context
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme'; 
import AppAppBar from '../shared/AppAppBar'; 
import Footer from '../shared/Footer';
import { useAuth } from '../../context/AuthContext'; 
import { fetchListingDetails } from '../../api/Listings';

// Import types
import { ListingDetails} from '../../types/listing';


const ViewListingPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>(); // Get ID from URL
  const navigate = useNavigate();
  const { accessToken } = useAuth(); // Needed for actions like Add to Cart

  const [listingDetails, setListingDetails] = useState<ListingDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    if (!listingId) {
      setError('Listing ID is missing.');
      setLoading(false);
      return;
    }

    const loadListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchListingDetails(localStorage.getItem('access_token') || "hello", listingId);
        if (data) {
          setListingDetails(data);
          setSelectedImageIndex(0); // Reset image index on new load
        } else {
          setError(`Listing with ID "${listingId}" not found or is unavailable.`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing details.');
        console.error('Error fetching listing details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [listingId]); // Re-fetch if listingId changes

  const handleAddToCart = () => {
    if (!listingDetails) return;
    // TODO: Implement Add to Cart logic
    // This would likely involve:
    // 1. Checking if user is authenticated (using useAuth)
    // 2. Making an API call to add the item (listingDetails.id, quantity) to the user's cart
    // 3. Providing user feedback (e.g., snackbar message)
    alert(`Adding ${listingDetails.title} to cart (ID: ${listingDetails.id}) - Requires API call`);
  };

  const handleContactSeller = () => {
     if (!listingDetails) return;
     // TODO: Implement Contact Seller logic
     // Could navigate to a chat page, open a modal, etc.
     alert(`Contacting seller ${listingDetails.seller.username} (ID: ${listingDetails.seller.id}) - Requires implementation`);
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
       <AppTheme> {/* Keep theme wrapper even for loading state */}
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
                <Button color="inherit" size="small" onClick={() => navigate(-1)}> {/* Go back */}
                    Go Back
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

  if (!listingDetails) {
    // Should be covered by error state if API returns null, but good practice
    return (
       <AppTheme>
         <CssBaseline enableColorScheme />
         <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
           <AppAppBar />
            <Container component="main" maxWidth="md" sx={{ pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, pb: 6, flexGrow: 1 }}>
                <Alert severity="warning">Listing details could not be loaded.</Alert>
            </Container>
           <Footer />
         </Box>
       </AppTheme>
    );
  }

  // --- Main Content Render ---
  const currentImage = listingDetails.images[selectedImageIndex] || { url: '', altText: 'Placeholder Image' }; // Handle empty images array

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppAppBar />

        <Container
          component="main"
          maxWidth="lg" // Use 'lg' for two-column layout
          sx={{
            pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, // Adjust padding top
            pb: 6, // Padding bottom
            flexGrow: 1,
          }}
        >
           <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
              Back
           </Button>

          <Grid container spacing={4}>
            {/* Left Column: Image Gallery */}
            <Grid item xs={12} md={7}>
               {/* Main Image */}
               <Box sx={{ mb: 2, position: 'relative', paddingTop: '75%', /* Aspect ratio 4:3 */ backgroundColor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                  <Box
                     component="img"
                     src={currentImage.url || '/path/to/placeholder.png'} // Provide a real placeholder path
                     alt={currentImage.altText || listingDetails.title}
                     sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain', // Use 'contain' or 'cover'
                     }}
                  />
               </Box>

               {/* Thumbnails */}
               {listingDetails.images.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                     {listingDetails.images.map((img, index) => (
                        <Box
                           key={img.id || index}
                           component="img"
                           src={img.url}
                           alt={img.altText || `Thumbnail ${index + 1}`}
                           onClick={() => setSelectedImageIndex(index)}
                           sx={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 1,
                              cursor: 'pointer',
                              border: selectedImageIndex === index ? '2px solid' : '2px solid transparent',
                              borderColor: selectedImageIndex === index ? 'primary.main' : 'transparent',
                              '&:hover': {
                                 opacity: 0.8,
                              }
                           }}
                        />
                     ))}
                  </Box>
               )}
            </Grid>

            {/* Right Column: Details & Actions */}
            <Grid item xs={12} md={5}>
               <Paper sx={{ p: 3, height: '100%' }}> {/* Add padding and ensure paper takes height */}
                  {/* Category */}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                     <CategoryIcon fontSize="inherit" sx={{ mr: 0.5 }}/> {listingDetails.category.name}
                  </Typography>

                  {/* Title */}
                  <Typography variant="h4" component="h1" gutterBottom>
                     {listingDetails.title}
                  </Typography>

                  {/* Price */}
                  <Typography variant="h5" color="primary.main" fontWeight="bold" sx={{ mb: 2 }}>
                     {formatCurrency(listingDetails.price)}
                  </Typography>

                  {/* Condition & Quantity */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                     <Chip icon={<ConditionIcon />} label={listingDetails.condition.name} size="small" variant="outlined"/>
                     {listingDetails.quantity > 0 && (
                        <Typography variant="body2" color="text.secondary">
                           {listingDetails.quantity} available
                        </Typography>
                     )}
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                     <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                        disabled={listingDetails.status !== 'Active' || listingDetails.quantity === 0} // Disable if not active or 0 quantity
                        fullWidth={true} // Make buttons full width on xs
                        sx={{ flexGrow: { sm: 1 } }} // Allow buttons to grow on sm+
                     >
                        Add to Cart
                     </Button>
                     <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleContactSeller}
                        fullWidth={true}
                        sx={{ flexGrow: { sm: 1 } }}
                     >
                        Contact Seller
                     </Button>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Seller Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                     <Avatar src={listingDetails.seller.avatarUrl || undefined} sx={{ width: 40, height: 40, mr: 1.5 }}>
                        <StorefrontIcon /> {/* Fallback */}
                     </Avatar>
                     <Box>
                        <Typography variant="body2" color="text.secondary">Sold by</Typography>
                        {/* Link to seller's profile page */}
                        <MuiLink component={RouterLink} to={`/user/${listingDetails.seller.username}`} underline="hover">
                           {listingDetails.seller.username}
                        </MuiLink>
                     </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Description */}
                  <Typography variant="h6" gutterBottom>Description</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}> {/* Preserve line breaks */}
                     {listingDetails.description || "No description provided."}
                  </Typography>

                  {/* Optional: Add Brand, Date Listed, Status etc. */}
                   <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                       {listingDetails.brand && (
                           <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                               Brand: {listingDetails.brand}
                           </Typography>
                       )}
                       <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                           Listed: {new Date(listingDetails.dateListed).toLocaleDateString()}
                       </Typography>
                       <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                           <InfoIcon fontSize="inherit" sx={{ mr: 0.5 }}/> Status: {listingDetails.status}
                       </Typography>
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

export default ViewListingPage;

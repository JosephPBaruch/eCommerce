import React from 'react';
import { useCart } from '../../context/CartContext';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  CircularProgress,
  Button,
  Paper,
  Box,
  Divider,
  Grid,
} from '@mui/material';
import { Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer';

const CartPage: React.FC = () => {
  const { cartItems, removeItem, loading } = useCart();
  const navigate = useNavigate();


  const appBarHeight = 64;
  const appBarMarginTop = 28;



  const renderCartContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (cartItems.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Your cart is empty.</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </Paper>
      );
    }


    const total = cartItems.reduce((sum, item) => sum + (Number(item.listing.price) * item.quantity), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <Grid container spacing={3}>
        {/* Cart Items List */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Shopping Cart ({totalItems} items)
            </Typography>
            <List>
              {cartItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar variant="square" sx={{ width: 60, height: 60, mr: 2, bgcolor: 'grey.200' }}>
                        ?
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.listing.title || item.listing.name || `Listing #${item.listing.id}`}
                      secondary={
                        <>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Product ID: {item.product_id}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            {/* Display the price from listing - fixed with Number conversion */}
                            <Typography variant="body2" sx={{ mr: 2 }}>
                              Price: ${Number(item.listing.price).toFixed(2)}
                            </Typography>
                            <Typography variant="body2">
                              Quantity: {item.quantity}
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                    <IconButton edge="end" aria-label="delete" onClick={() => removeItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {/* Display actual subtotal */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal ({totalItems} items)</Typography>
              <Typography fontWeight="medium">${total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography fontWeight="medium">$0.00</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Estimated Tax</Typography>
              <Typography fontWeight="medium">$0.00</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Estimated Total</Typography>
              <Typography variant="h6" fontWeight="bold">${total.toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={cartItems.length === 0 || loading}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    );
  };


  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppAppBar />
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            pt: `calc(${appBarHeight}px + ${appBarMarginTop}px + 32px)`,
            pb: 6,
            flexGrow: 1,
          }}
        >
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
            Back
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Cart
          </Typography>

          {renderCartContent()}

        </Container>
        <Footer />
      </Box>
    </AppTheme>
  );
};

export default CartPage;

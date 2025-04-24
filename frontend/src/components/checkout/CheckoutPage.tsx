import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  FormHelperText,
} from '@mui/material';

import AppTheme from '../../theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer';
import { useCart } from '../../context/CartContext';

// Types for form data
interface ShippingFormData {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

interface PaymentFormData {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartId, cartItems, removeItem, } = useCart();
  // const { accessToken } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form states
  const [shippingInfo, setShippingInfo] = useState<ShippingFormData>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentFormData>({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Form validation states
  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingFormData>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<PaymentFormData>>({});

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (!cartItems || cartItems.length === 0) {
      console.log(cartId)
      navigate('/cart');
    }
  }, [cartId, cartItems, navigate]);

  const steps = ['Shipping Information', 'Payment Details', 'Review Order'];

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate shipping form
      const errors: Partial<ShippingFormData> = {};

      if (!shippingInfo.fullName) errors.fullName = 'Name is required';
      if (!shippingInfo.addressLine1) errors.addressLine1 = 'Address is required';
      if (!shippingInfo.city) errors.city = 'City is required';
      if (!shippingInfo.state) errors.state = 'State is required';
      if (!shippingInfo.zipCode) errors.zipCode = 'ZIP Code is required';
      if (!shippingInfo.country) errors.country = 'Country is required';

      if (Object.keys(errors).length > 0) {
        setShippingErrors(errors);
        return;
      }
    }

    if (activeStep === 1) {
      // Validate payment form
      const errors: Partial<PaymentFormData> = {};

      if (!paymentInfo.cardName) errors.cardName = 'Name on card is required';
      if (!paymentInfo.cardNumber) errors.cardNumber = 'Card number is required';
      if (!paymentInfo.expiryDate) errors.expiryDate = 'Expiry date is required';
      if (!paymentInfo.cvv) errors.cvv = 'CVV is required';

      if (Object.keys(errors).length > 0) {
        setPaymentErrors(errors);
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });

    // Clear error for this field if it exists
    if (shippingErrors[name as keyof ShippingFormData]) {
      setShippingErrors({
        ...shippingErrors,
        [name]: undefined,
      });
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });

    // Clear error for this field if it exists
    if (paymentErrors[name as keyof PaymentFormData]) {
      setPaymentErrors({
        ...paymentErrors,
        [name]: undefined,
      });
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          addressLine1: shippingInfo.addressLine1,
          addressLine2: shippingInfo.addressLine2,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phoneNumber: shippingInfo.phoneNumber
        },
      };

      // Make API call to create order
      const response = await fetch('https://joestack.org/v1/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          created_at: new Date().toISOString(), 
          status: "Recieved", 
          cart: cartId
        })
      });

      console.log(orderData)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      // Order successful
      setOrderPlaced(true);
      for (const item of cartItems) {
        await removeItem(item.id);
      }
      setTimeout(() => {
        navigate('/profile/orders');
      }, 2500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
      console.error('Order placement error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.listing?.price ?? 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Render form based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.fullName}
                  onChange={handleShippingChange}
                  error={!!shippingErrors.fullName}
                  helperText={shippingErrors.fullName}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  id="addressLine1"
                  name="addressLine1"
                  label="Address Line 1"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.addressLine1}
                  onChange={handleShippingChange}
                  error={!!shippingErrors.addressLine1}
                  helperText={shippingErrors.addressLine1}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  id="addressLine2"
                  name="addressLine2"
                  label="Address Line 2 (Optional)"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.addressLine2}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  error={!!shippingErrors.city}
                  helperText={shippingErrors.city}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  id="state"
                  name="state"
                  label="State/Province/Region"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.state}
                  onChange={handleShippingChange}
                  error={!!shippingErrors.state}
                  helperText={shippingErrors.state}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  id="zipCode"
                  name="zipCode"
                  label="Zip / Postal Code"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.zipCode}
                  onChange={handleShippingChange}
                  error={!!shippingErrors.zipCode}
                  helperText={shippingErrors.zipCode}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  id="country"
                  name="country"
                  label="Country"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.country}
                  onChange={handleShippingChange}
                  error={!!shippingErrors.country}
                  helperText={shippingErrors.country}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.phoneNumber}
                  onChange={handleShippingChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  id="cardName"
                  name="cardName"
                  label="Name on Card"
                  fullWidth
                  variant="outlined"
                  value={paymentInfo.cardName}
                  onChange={handlePaymentChange}
                  error={!!paymentErrors.cardName}
                  helperText={paymentErrors.cardName}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  id="cardNumber"
                  name="cardNumber"
                  label="Card Number"
                  fullWidth
                  variant="outlined"
                  inputProps={{ maxLength: 19 }}
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  error={!!paymentErrors.cardNumber}
                  helperText={paymentErrors.cardNumber}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  id="expiryDate"
                  name="expiryDate"
                  label="Expiry Date"
                  placeholder="MM/YY"
                  fullWidth
                  variant="outlined"
                  inputProps={{ maxLength: 5 }}
                  value={paymentInfo.expiryDate}
                  onChange={handlePaymentChange}
                  error={!!paymentErrors.expiryDate}
                  helperText={paymentErrors.expiryDate}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  id="cvv"
                  name="cvv"
                  label="CVV"
                  type="password"
                  fullWidth
                  variant="outlined"
                  inputProps={{ maxLength: 4 }}
                  value={paymentInfo.cvv}
                  onChange={handlePaymentChange}
                  error={!!paymentErrors.cvv}
                  helperText={paymentErrors.cvv}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormHelperText>
                  * This is a demo checkout. No actual payment will be processed.
                </FormHelperText>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List disablePadding>
              {cartItems.map((item) => (
                <ListItem key={item.product_id} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={item.listing.title || item.listing.name}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <Typography variant="body2">
                    {formatCurrency((item.listing?.price ?? 0) * item.quantity)}
                  </Typography>
                </ListItem>
              ))}
              <Divider sx={{ my: 2 }} />
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {formatCurrency(calculateTotal())}
                </Typography>
              </ListItem>
            </List>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography gutterBottom>{shippingInfo.fullName}</Typography>
                <Typography gutterBottom>{shippingInfo.addressLine1}</Typography>
                {shippingInfo.addressLine2 && (
                  <Typography gutterBottom>{shippingInfo.addressLine2}</Typography>
                )}
                <Typography gutterBottom>
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                </Typography>
                <Typography gutterBottom>{shippingInfo.country}</Typography>
                {shippingInfo.phoneNumber && (
                  <Typography gutterBottom>Phone: {shippingInfo.phoneNumber}</Typography>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Details
                </Typography>
                <Typography gutterBottom>
                  Card: **** **** **** {paymentInfo.cardNumber.slice(-4)}
                </Typography>
                <Typography gutterBottom>
                  Name on Card: {paymentInfo.cardName}
                </Typography>
                <Typography gutterBottom>
                  Expires: {paymentInfo.expiryDate}
                </Typography>
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {orderPlaced && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Order placed successfully! Redirecting to your orders page...
              </Alert>
            )}
          </Box>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  // Navigation buttons
  const renderNavigationButtons = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
        >
          Back
        </Button>
        <div>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
              disabled={loading || orderPlaced}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
            >
              Next
            </Button>
          )}
        </div>
      </Box>
    );
  };

  // Estimate AppBar height
  const appBarHeight = 64;
  const appBarMarginTop = 0;

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppAppBar />
        <Container component="main" maxWidth="md" sx={{ flexGrow: 1, pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, pb: 6 }}>
          <Paper sx={{ p: { xs: 2, md: 4 } }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent()}
            {renderNavigationButtons()}
          </Paper>
        </Container>
        <Footer />
      </Box>
    </AppTheme>
  );
};

export default CheckoutPage;

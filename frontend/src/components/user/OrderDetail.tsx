import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    CircularProgress,
    Alert,
    Button,
    IconButton,
} from '@mui/material';
import {
    ArrowBack,
} from '@mui/icons-material';
import Grid from '@mui/material/GridLegacy';

import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer';
import { useAuth } from '../../context/AuthContext';

interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    cart: string;
    product_name?: string;     price?: number; 
}

interface Cart {
    id: string;
    user: string;
    created_at: string;
    status: string;
    shipping_address: string;
    billing_address: string;
    items: CartItem[];
}

interface Order {
    id: string;
    created_at: string;
    status: 'Received' | 'Shipped' | 'Delivered';
    cart: string;
    cartData?: Cart; 
}


const API_BASE_URL = import.meta.env.PROD
  ? `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`
  : '/api';

const fetchOrderDetails = async (token: string, orderId: string): Promise<Order | null> => {
    console.log(`Fetching details for order: ${orderId}`);

    try {
        if (!token) {
            throw new Error('Authentication token not found');
        }

        
        const orderResponse = await fetch(`${API_BASE_URL}/orders/${orderId}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!orderResponse.ok) {
            if (orderResponse.status === 404) {
                return null;
            }
            throw new Error(`Error fetching order: ${orderResponse.statusText}`);
        }

        const orderData: Order = await orderResponse.json();
        
        
        if (orderData.cart) {
            const cartResponse = await fetch(`${API_BASE_URL}/cart/${orderData.cart}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!cartResponse.ok) {
                throw new Error(`Error fetching cart: ${cartResponse.statusText}`);
            }

            const cartData: Cart = await cartResponse.json();
            
            
            const cartItemsResponse = await fetch(`${API_BASE_URL}/cart/items/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!cartItemsResponse.ok) {
                throw new Error(`Error fetching cart items: ${cartItemsResponse.statusText}`);
            }

            const allCartItems = await cartItemsResponse.json();
            
            
            const cartItems: CartItem[] = allCartItems.filter((item: { cart: string }) => 
                item.cart === cartData.id
            );
            
            
            const itemsWithProductDetails = await Promise.all(
                cartItems.map(async (item: CartItem) => {
                    const productResponse = await fetch(`${API_BASE_URL}/products/${item.product_id}/`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (productResponse.ok) {
                        const product = await productResponse.json();
                        return {
                            ...item,
                            product_name: product.name,
                            price: parseFloat(product.price)
                        };
                    }
                    
                    return {
                        ...item,
                        product_name: 'Product unavailable',
                        price: 0
                    };
                })
            );
            
            
            orderData.cartData = {
                ...cartData,
                items: itemsWithProductDetails
            };
        }

        return orderData;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
};

const OrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    const [orderDetails, setOrderDetails] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError('Order ID is missing.');
            setLoading(false);
            return;
        }

        const loadOrderDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = accessToken || localStorage.getItem('access_token') || "";
                const data = await fetchOrderDetails(token, orderId);
                if (data) {
                    setOrderDetails(data);
                } else {
                    setError(`Order with ID "${orderId}" not found.`);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                console.error('Error fetching order details:', err);
            } finally {
                setLoading(false);
            }
        };

        loadOrderDetails();
    }, [orderId, accessToken]);

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusChipColor = (
        status: string
    ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
        switch (status) {
            case 'Delivered':
                return 'success';
            case 'Shipped':
                return 'info';
            case 'Received':
                return 'warning';
            default:
                return 'default';
        }
    };

    
    if (loading) {
        return (
            <AppTheme>
                <CssBaseline enableColorScheme />
                <AppAppBar />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', mt: 15 }}>
                    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Container>
                </Box>
                <Footer />
            </AppTheme>
        );
    }

    if (error) {
        return (
            <AppTheme>
                <CssBaseline enableColorScheme />
                <AppAppBar />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', mt: 15 }}>
                    <Container sx={{ mt: 3 }}>
                        <Alert severity="error" action={
                            <Button color="inherit" size="small" onClick={() => navigate('/orders')}>
                                Back to Orders
                            </Button>
                        }>
                            {error}
                        </Alert>
                    </Container>
                </Box>
                <Footer />
            </AppTheme>
        );
    }

    if (!orderDetails) {
        return (
            <AppTheme>
                <CssBaseline enableColorScheme />
                <AppAppBar />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', mt: 15 }}>
                    <Container sx={{ mt: 3 }}>
                        <Alert severity="warning">Order details could not be loaded.</Alert>
                    </Container>
                </Box>
                <Footer />
            </AppTheme>
        );
    }

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', mt: 15, mb: -45 }}>
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={() => navigate(-1)} aria-label="go back" sx={{ mr: 1 }}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h4" component="h1">
                            Order Details
                        </Typography>
                    </Box>

                    {/* Order Summary Header */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body2" color="text.secondary">Order ID</Typography>
                                <Typography variant="subtitle1" fontWeight="medium">{orderDetails.id}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body2" color="text.secondary">Date Created</Typography>
                                <Typography variant="subtitle1">{formatDate(orderDetails.created_at)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Chip
                                    label={orderDetails.status}
                                    color={getStatusChipColor(orderDetails.status)}
                                    size="medium"
                                    sx={{ width: '100%', justifyContent: 'center' }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {orderDetails.cartData && (() => {
                        const cartData = orderDetails.cartData; 
                        return (
                            <>
                                {/* Cart Information */}
                                <Paper sx={{ p: 2, mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Cart Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">Cart ID</Typography>
                                            <Typography variant="body1">{cartData.id}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">Cart Status</Typography>
                                            <Typography variant="body1">{cartData.status}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">Shipping Address</Typography>
                                            <Typography variant="body1">{cartData.shipping_address}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">Billing Address</Typography>
                                            <Typography variant="body1">{cartData.billing_address}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Cart Items */}
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Items ({cartData.items.length})
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <List disablePadding>
                                        {cartData.items.map((item, index) => (
                                            <React.Fragment key={item.id}>
                                                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                                    <ListItemText
                                                        primary={item.product_name || 'Product'}
                                                        secondary={
                                                            <>
                                                                <Typography component="span" variant="body2" color="text.secondary">
                                                                    Product ID: {item.product_id}
                                                                </Typography>
                                                                <Typography component="span" variant="body2" color="text.secondary" display="block">
                                                                    Quantity: {item.quantity}
                                                                </Typography>
                                                                {item.price !== undefined && (
                                                                    <Typography component="span" variant="body2" color="text.primary" display="block">
                                                                        Price: {formatCurrency(item.price)} each
                                                                    </Typography>
                                                                )}
                                                            </>
                                                        }
                                                    />
                                                    {item.price !== undefined && (
                                                        <Typography variant="body1" fontWeight="medium" sx={{ textAlign: 'right' }}>
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </Typography>
                                                    )}
                                                </ListItem>
                                                {index < cartData.items.length - 1 && <Divider component="li" />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Paper>
                            </>
                        );
                    })()}

                    {!orderDetails.cartData && (
                        <Paper sx={{ p: 2 }}>
                            <Alert severity="info">
                                This order has no associated cart data.
                            </Alert>
                        </Paper>
                    )}
                </Container>
            </Box>
            <Footer />
        </AppTheme>
    );
};

export default OrderDetailsPage;

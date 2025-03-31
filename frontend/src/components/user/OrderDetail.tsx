import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming React Router
import {
    Container,
    Typography,
    Paper,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Chip,
    CircularProgress,
    Alert,
    Button,
    Link as MuiLink, // Alias to avoid conflict with potential Router Link
    IconButton,
} from '@mui/material';
import {
    LocalShipping,
    ShoppingCart,
    Summarize,
    ArrowBack,
    Inventory, // Icon for items
    PinDrop, // Icon for address
    Payment, // Icon for payment
    TrackChanges, // Icon for tracking
} from '@mui/icons-material';
import Grid from '@mui/material/GridLegacy';

import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer';

// Reusing Address from previous examples if defined elsewhere
export interface Address {
    id: string;
    name?: string; // Name associated with the address (e.g., John Doe)
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface OrderItem {
    id: string; // Usually the product variant ID
    productId: string;
    name: string;
    imageUrl?: string;
    quantity: number;
    price: number; // Price per unit at the time of order
    sku?: string; // Optional Stock Keeping Unit
}

export interface PaymentSummary {
    method: string; // e.g., "Credit Card", "PayPal"
    last4?: string; // Last 4 digits for cards
    brand?: string; // e.g., "Visa", "Mastercard"
}

export interface OrderDetails {
    id: string;
    orderNumber: string;
    date: string; // ISO date string
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Pending';
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress: Address;
    payment: PaymentSummary;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount?: number; // Optional discount amount
    total: number;
    trackingNumber?: string; // Optional, available when shipped
    trackingUrl?: string; // Optional URL for tracking
}


// --- Mock API Function ---

const fetchOrderDetails = async (orderId: string): Promise<OrderDetails | null> => {
    console.log(`Fetching details for order: ${orderId}`);

    // Simulate not found
    if (orderId === 'invalid-order-id') {
        return null;
    }

    // --- Generate Mock Data ---
    const mockAddress: Address = {
        id: 'addr1',
        name: 'Jane Doe',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
    };

    const mockItems: OrderItem[] = [
        {
            id: 'item1',
            productId: 'prodA',
            name: 'Stylish Wireless Headphones',
            imageUrl: '/path/to/headphones.jpg', // Replace with actual image path
            quantity: 1,
            price: 79.99,
            sku: 'SKU-HP-BLK',
        },
        {
            id: 'item2',
            productId: 'prodB',
            name: 'Ergonomic Mouse',
            imageUrl: '/path/to/mouse.jpg', // Replace with actual image path
            quantity: 1,
            price: 25.5,
            sku: 'SKU-MS-ERG',
        },
        {
            id: 'item3',
            productId: 'prodC',
            name: 'USB-C Cable (3ft)',
            // No image example
            quantity: 2,
            price: 8.99,
            sku: 'SKU-CB-UC-3',
        },
    ];

    const subtotal = mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal > 50 ? 0 : 5.99; // Example logic
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;
    const status = orderId === 'ORD-12345' ? 'Delivered' : 'Shipped'; // Example status variation

    const mockOrder: OrderDetails = {
        id: orderId,
        orderNumber: orderId.toUpperCase(), // Example: ORD-12345
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // Ordered 7 days ago
        status: status,
        items: mockItems,
        shippingAddress: { ...mockAddress, id: 'addr_ship' },
        billingAddress: { ...mockAddress, id: 'addr_bill' }, // Often same as shipping
        payment: {
            method: 'Credit Card',
            brand: 'Visa',
            last4: '1234',
        },
        subtotal: subtotal,
        shippingCost: shippingCost,
        tax: tax,
        total: total,
    };
    // --- End Generate Mock Data ---

    return mockOrder;
};
// --- End Mock API Function ---

const OrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>(); // Get orderId from URL
    const navigate = useNavigate(); // Hook for navigation

    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
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
                const data = await fetchOrderDetails(orderId);
                if (data) {
                    setOrderDetails(data);
                } else {
                    setError(`Order with ID "${orderId}" not found.`);
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An unknown error occurred',
                );
                console.error('Error fetching order details:', err);
            } finally {
                setLoading(false);
            }
        };

        loadOrderDetails();
    }, [orderId]); // Re-fetch if orderId changes

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
            currency: 'USD', // Adjust currency as needed
        }).format(amount);
    };

    const getStatusChipColor = (
        status: OrderDetails['status'],
    ):
        | 'default'
        | 'primary'
        | 'secondary'
        | 'error'
        | 'info'
        | 'success'
        | 'warning' => {
        // Same logic as before
        switch (status) {
            case 'Delivered':
                return 'success';
            case 'Shipped':
                return 'info';
            case 'Processing':
                return 'warning';
            case 'Pending':
                return 'secondary';
            case 'Cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const renderAddress = (address: Address, title: string, icon: React.ReactNode) => (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {icon} {title}
            </Typography>
            <Typography variant="body2">{address.name}</Typography>
            <Typography variant="body2">{address.street}</Typography>
            <Typography variant="body2">
                {address.city}, {address.state} {address.zipCode}
            </Typography>
            <Typography variant="body2">{address.country}</Typography>
        </Box>
    );

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
                <Alert severity="error" action={
                    <Button color="inherit" size="small" onClick={() => navigate('/orders')}> {/* Navigate back to history */}
                        Back to Orders
                    </Button>
                }>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!orderDetails) {
        // This case might be covered by the error state if API returns null/404
        return (
            <Container sx={{ mt: 3 }}>
                <Alert severity="warning">Order details could not be loaded.</Alert>
            </Container>
        );
    }

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh',mt: 15, mb:-45}}>
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
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" color="text.secondary">Order Number</Typography>
                                <Typography variant="subtitle1" fontWeight="medium">{orderDetails.orderNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body2" color="text.secondary">Date Placed</Typography>
                                <Typography variant="subtitle1">{formatDate(orderDetails.date)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                                <Typography variant="subtitle1" fontWeight="medium">{formatCurrency(orderDetails.total)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <Chip
                                    label={orderDetails.status}
                                    color={getStatusChipColor(orderDetails.status)}
                                    size="medium" // Slightly larger chip for header
                                    icon={
                                        orderDetails.status === 'Shipped' || orderDetails.status === 'Delivered'
                                            ? <LocalShipping fontSize="small" />
                                            : undefined
                                    }
                                    sx={{ width: '100%', justifyContent: 'center' }}
                                />
                            </Grid>
                        </Grid>
                        {orderDetails.trackingNumber && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrackChanges sx={{ mr: 1, fontSize: '1.2rem' }} color="action" />
                                    Tracking Number: {' '}
                                    {orderDetails.trackingUrl ? (
                                        <MuiLink href={orderDetails.trackingUrl} target="_blank" rel="noopener noreferrer" sx={{ ml: 0.5 }}>
                                            {orderDetails.trackingNumber}
                                        </MuiLink>
                                    ) : (
                                        orderDetails.trackingNumber
                                    )}
                                </Typography>
                            </Box>
                        )}
                    </Paper>

                    <Grid container spacing={3}>
                        {/* Left Column: Items */}
                        <Grid item xs={12} md={7}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Inventory sx={{ mr: 1 }} /> Items Ordered ({orderDetails.items.length})
                                </Typography>
                                <Divider sx={{ mb: 1 }} />
                                <List disablePadding>
                                    {orderDetails.items.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                                <ListItemAvatar sx={{ mr: 2 }}>
                                                    <Avatar
                                                        variant="rounded" // Use rounded for product images
                                                        src={item.imageUrl || undefined} // Handle missing image
                                                        alt={item.name}
                                                        sx={{ width: 60, height: 60, bgcolor: 'grey.200' }} // Add background color
                                                    >
                                                        <ShoppingCart /> {/* Fallback icon */}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={item.name}
                                                    secondary={
                                                        <>
                                                            {item.sku && (
                                                                <Typography component="span" variant="body2" color="text.secondary" display="block">
                                                                    SKU: {item.sku}
                                                                </Typography>
                                                            )}
                                                            <Typography component="span" variant="body2" color="text.secondary">
                                                                Qty: {item.quantity}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                                <Typography variant="body1" fontWeight="medium" sx={{ ml: 2, textAlign: 'right' }}>
                                                    {formatCurrency(item.price * item.quantity)}
                                                    {item.quantity > 1 && (
                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                            ({formatCurrency(item.price)} each)
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            </ListItem>
                                            {index < orderDetails.items.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>

                        {/* Right Column: Addresses, Payment, Totals */}
                        <Grid item xs={12} md={5}>
                            {/* Shipping & Billing */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={12} lg={6}>
                                        {renderAddress(orderDetails.shippingAddress, 'Shipping Address', <PinDrop sx={{ mr: 1, fontSize: '1.3rem' }} />)}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={12} lg={6}>
                                        {renderAddress(orderDetails.billingAddress, 'Billing Address', <PinDrop sx={{ mr: 1, fontSize: '1.3rem' }} />)}
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Payment Method */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Payment sx={{ mr: 1 }} /> Payment Method
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="body1">
                                    {orderDetails.payment.method}
                                    {orderDetails.payment.brand && ` (${orderDetails.payment.brand})`}
                                </Typography>
                                {orderDetails.payment.last4 && (
                                    <Typography variant="body2" color="text.secondary">
                                        Ending in **** {orderDetails.payment.last4}
                                    </Typography>
                                )}
                            </Paper>

                            {/* Order Summary Totals */}
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Summarize sx={{ mr: 1 }} /> Order Summary
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Subtotal:</Typography>
                                    <Typography variant="body1">{formatCurrency(orderDetails.subtotal)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Shipping:</Typography>
                                    <Typography variant="body1">{formatCurrency(orderDetails.shippingCost)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Tax:</Typography>
                                    <Typography variant="body1">{formatCurrency(orderDetails.tax)}</Typography>
                                </Box>
                                {orderDetails.discount && orderDetails.discount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'success.main' }}>
                                        <Typography variant="body1" color="inherit">Discount:</Typography>
                                        <Typography variant="body1" color="inherit">-{formatCurrency(orderDetails.discount)}</Typography>
                                    </Box>
                                )}
                                <Divider sx={{ my: 1.5 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="h6">Grand Total:</Typography>
                                    <Typography variant="h6" fontWeight="bold">{formatCurrency(orderDetails.total)}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Footer />
        </AppTheme>
    );
};

export default OrderDetailsPage;

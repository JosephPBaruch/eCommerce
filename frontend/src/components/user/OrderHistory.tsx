import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Pagination,
  Button,
  IconButton,
} from '@mui/material';
import { ShoppingBag, ReceiptLong, Visibility } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer';


export interface OrderSummary {
  id: string;
  orderNumber: string;
  date: string; // ISO date string ideally
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Pending';
  itemCount: number; // Added for more context on the history page
}

// Optional: Interface for the API response if it includes pagination metadata
export interface OrderHistoryResponse {
  orders: OrderSummary[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}


const ITEMS_PER_PAGE = 10;

// --- Mock API Function ---
const fetchOrderHistory = async (
  userId: string,
  page: number,
  limit: number,
): Promise<OrderHistoryResponse> => {
  console.log(`Fetching order history for user: ${userId}, page: ${page}, limit: ${limit}`);

  // --- Generate Mock Data ---
  const totalOrders = 35; // Example total
  const totalPages = Math.ceil(totalOrders / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalOrders);

  const statuses: OrderSummary['status'][] = [
    'Delivered',
    'Shipped',
    'Processing',
    'Cancelled',
    'Pending',
  ];
  const mockOrders: OrderSummary[] = [];

  if (page <= totalPages) {
    for (let i = startIndex; i < endIndex; i++) {
      const orderId = `order${1000 + i}`;
      const daysAgo = 5 + i * 3; // Varying dates
      const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo).toISOString();
      mockOrders.push({
        id: orderId,
        orderNumber: `ORD-${String(12345 + i).padStart(6, '0')}`,
        date: date,
        total: Math.round((Math.random() * 200 + 20) * 100) / 100, // Random total between 20 and 220
        status: statuses[i % statuses.length],
        itemCount: Math.floor(Math.random() * 5) + 1, // 1 to 5 items
      });
    }
  }
  // --- End Generate Mock Data ---

  return {
    orders: mockOrders,
    currentPage: page,
    totalPages: totalPages,
    totalCount: totalOrders,
  };
};
// --- End Mock API Function ---

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();
  // TODO: Replace 'user123' with the actual logged-in user ID
  const userId = 'user123';

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchOrderHistory(userId, page, ITEMS_PER_PAGE);
        setOrders(response.orders);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
        console.error('Error fetching order history:', err);
        setOrders([]); // Clear orders on error
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [userId, page]); // Re-fetch when userId or page changes

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Optional: Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (orderId: string) => {
    // Replace with actual navigation logic (e.g., using useNavigate)
    // alert(`Navigate to details page for order: ${orderId}`);
    navigate(`./${orderId}`);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD', // Adjust currency as needed
    }).format(amount);
  };

  const getStatusChipColor = (
    status: OrderSummary['status'],
  ):
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning' => {
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
  const appBarHeight = 45; 
  const appBarMarginTop = 0; 
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth:'50%'}}>
      <Container component="main" 
      sx={{
        pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, // Padding top to clear the AppBar (convert px to rem approx) + extra space
        pb: 6, // Padding bottom for space above footer
        flexGrow: 1, // Allow this container to grow and push footer down
        display: 'flex', // Keep flex for internal alignment if needed
        flexDirection: 'column', // Keep column direction
        gap: 3, // Adjust gap between elements if needed
        // minWidth: '100%'
      }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptLong sx={{ mr: 1.5, fontSize: '2.5rem' }} /> Order History
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 3 }}>
            Error loading order history: {error}. Please try refreshing the page.
          </Alert>
        )}

        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', mt: 3 }}>
                <ShoppingBag sx={{ fontSize: 50, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6">No Orders Found</Typography>
                <Typography color="text.secondary">
                  You haven't placed any orders yet.
                </Typography>
                <Button variant="contained" sx={{ mt: 3 }} onClick={() => alert('Navigate to Home/Shop page')}>
                  Start Shopping
                </Button>
              </Paper>
            ) : (
              <Paper sx={{ mt: 2}}>
                <List disablePadding>
                  {orders.map((order, index) => (
                    <React.Fragment key={order.id}>
                      <ListItem
                        secondaryAction={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={order.status}
                              color={getStatusChipColor(order.status)}
                              size="small"
                              sx={{ minWidth: '80px', justifyContent: 'center' }} // Ensure consistent chip width
                            />
                            <IconButton
                              edge="end"
                              aria-label={`view details for order ${order.orderNumber}`}
                              onClick={() => handleViewDetails(order.id)}
                              size="small"
                              title="View Details" // Tooltip for accessibility
                            >
                              <Visibility />
                            </IconButton>
                          </Box>
                        }
                        sx={{ py: 2, minWidth: 750}} // Add padding top/bottom
                      >
                        <ListItemText
                          primary={`Order #${order.orderNumber}`}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {formatDate(order.date)}
                              </Typography>
                              {' — '}
                              {order.itemCount} item(s)
                              {' — '}
                              <Typography component="span" variant="body2" fontWeight="medium">
                                {formatCurrency(order.total)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < orders.length - 1 && <Divider component="li" variant="inset" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Container>
      <Footer />
      </Box>
    </AppTheme>
  );
};

export default OrderHistoryPage;

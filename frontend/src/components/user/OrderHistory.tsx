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
import { useAuth } from '../../context/AuthContext';
import { fetchOrders } from '../../api/Orders';
import { OrderSummary } from '../../types/listing';

const ITEMS_PER_PAGE = 10;

const OrderHistoryPage: React.FC = () => {
  const [allOrders, setAllOrders] = useState<OrderSummary[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiOrders = await fetchOrders(localStorage.getItem('access_token') || "");

        const mappedOrders: OrderSummary[] = apiOrders.map(order => ({
          id: order.id,
          date: order.created_at,
          status: order.status,
        }));

        setAllOrders(mappedOrders);
        setTotalPages(Math.ceil(mappedOrders.length / ITEMS_PER_PAGE));

        updateDisplayedOrders(mappedOrders, 1);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [accessToken]);

  useEffect(() => {
    updateDisplayedOrders(allOrders, page);
  }, [page, allOrders]);

  const updateDisplayedOrders = (orders: OrderSummary[], pageNum: number) => {
    const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedOrders(orders.slice(startIndex, endIndex));
  };

  const handleError = (err: unknown) => {
    let errorMessage = 'An unknown error occurred while fetching orders.';
    if (err instanceof Error) {
      if (err.message.includes('Unauthorized')) {
        errorMessage = 'Your session may have expired. Please log in again.';
        navigate('/signin');
      } else {
        errorMessage = err.message;
      }
    }
    setError(errorMessage);
    console.error('Error loading order history:', err);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  if (loading) {
    return (
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppAppBar />
          <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, pt: 10 }}>
            <CircularProgress />
          </Container>
          <Footer />
        </Box>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppAppBar />
        <Container component="main" sx={{ pt: 10, pb: 6, flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ReceiptLong sx={{ mr: 1.5, fontSize: '2.5rem' }} /> Order History
          </Typography>

          {error && (
            <Alert severity="error" sx={{ my: 3 }}>
              {error}
              {(error.includes('Please log in') || error.includes('session')) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/signin')}
                  sx={{ ml: 2 }}
                >
                  Log In
                </Button>
              )}
            </Alert>
          )}

          {!error && (
            <>
              {allOrders.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center', mt: 3 }}>
                  <ShoppingBag sx={{ fontSize: 50, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6">No Orders Found</Typography>
                  <Typography color="text.secondary">
                    You haven't placed any orders yet.
                  </Typography>
                  <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/')}>
                    Start Shopping
                  </Button>
                </Paper>
              ) : (
                <Paper sx={{ mt: 2, overflow: 'hidden' }}>
                  <List disablePadding>
                    {displayedOrders.map((order, index) => (
                      <React.Fragment key={order.id}>
                        <ListItem>
                          <ListItemText
                            primary={`Order #${order.id.substring(0, 8)}...`}
                            secondary={formatDate(order.date)}
                          />
                        </ListItem>
                        {index < displayedOrders.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              )}

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

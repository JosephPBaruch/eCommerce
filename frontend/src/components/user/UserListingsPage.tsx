import React, { useState, useEffect, ChangeEvent } from 'react';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Chip,
    CircularProgress,
    Alert,
    Box,
    Pagination,
    Button,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    ListAlt as ListAltIcon, // Icon for page title
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    DeleteOutline as DeleteIcon, // Or DeleteForever
    Inventory as InventoryIcon, // Fallback for image
    AddShoppingCart as AddShoppingCartIcon, // For "List an Item" button
    WarningAmber as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import shared components & context
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme'; 
import AppAppBar from '../shared/AppAppBar'; 
import Footer from '../shared/Footer';
import { useAuth } from '../../context/AuthContext';
import { fetchUserListings, deleteListingApi } from '../../api/Listings';
// Import types
import { UserListingSummary } from '../../types/listing'; 


const ITEMS_PER_PAGE = 10;

const UserListingsPage: React.FC = () => {
    const [listings, setListings] = useState<UserListingSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();
    const { accessToken, uid } = useAuth(); // Get token and potentially user ID if needed by API

    // Delete Confirmation Dialog State
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [listingToDelete, setListingToDelete] = useState<UserListingSummary | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);


    useEffect(() => {
        const loadListings = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchUserListings( page, ITEMS_PER_PAGE, localStorage.getItem("access_token"));
                setListings(response.listings);
                setTotalPages(response.totalPages);
            } catch (err) {
                if (err instanceof Error && err.message === 'Unauthorized') {
                    navigate('/signin'); // Redirect to sign-in page
                } else {
                    setError(err instanceof Error ? err.message : 'Failed to load listings.');
                }
                console.error('Error fetching listings:', err);
                setListings([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        loadListings();
    }, [uid, page, accessToken]); // Re-fetch if user, page, or token changes

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewListing = (listingId: string) => {
        // Navigate to the public view of the listing
        navigate(`/listing/${listingId}`); // Adjust path as needed
    };

    const handleEditListing = (listingId: string) => {
        // Navigate to the edit page for the listing
        navigate(`/listing/${listingId}/edit`); // Adjust path as needed
    };

    const handleOpenConfirmDialog = (listing: UserListingSummary) => {
        setListingToDelete(listing);
        setConfirmDialogOpen(true);
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setListingToDelete(null);
    };

    const handleDeleteConfirmed = async () => {
        if (!listingToDelete) return;
        setIsDeleting(true);
        setError(null);
        try {
            await deleteListingApi(listingToDelete.id, accessToken);
            setListings(prev => prev.filter(l => l.id !== listingToDelete.id));
            handleCloseConfirmDialog();
        } catch (err) {
            if (err instanceof Error && err.message === 'Unauthorized') {
                navigate('/signin'); // Redirect to sign-in page
            } else {
                setError(err instanceof Error ? err.message : 'Failed to delete listing.');
            }
            console.error('Error deleting listing:', err);
        } finally {
            setIsDeleting(false);
        }
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
        status: UserListingSummary['status'],
    ):
        | 'default'
        | 'primary'
        | 'secondary'
        | 'error'
        | 'info'
        | 'success'
        | 'warning' => {
        switch (status) {
            case 'Active':
                return 'success';
            case 'Sold':
                return 'secondary';
            case 'Inactive':
                return 'default';
            case 'Draft':
                return 'warning';
            default:
                return 'default';
        }
    };

    // Estimate AppBar height
    const appBarHeight = 64;
    const appBarMarginTop = 28;

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppAppBar />

                <Container
                    component="main"
                    maxWidth="lg" // Use 'lg' for potentially wider list items
                    sx={{
                        pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, // Adjust padding top
                        pb: 6, // Padding bottom
                        flexGrow: 1,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <ListAltIcon sx={{ mr: 1.5, fontSize: '2.5rem' }} /> My Listings
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddShoppingCartIcon />}
                            onClick={() => navigate('/sell')} // Navigate to the sell page
                            disabled={loading}
                        >
                            List New Item
                        </Button>
                    </Box>


                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ my: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {!loading && !error && (
                        <>
                            {listings.length === 0 ? (
                                <Paper sx={{ p: 3, textAlign: 'center', mt: 3 }}>
                                    <InventoryIcon sx={{ fontSize: 50, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6">You haven't listed any items yet.</Typography>
                                    <Typography color="text.secondary">
                                        Click below to start selling!
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 3 }}
                                        onClick={() => navigate('/sell')}
                                        startIcon={<AddShoppingCartIcon />}
                                    >
                                        List an Item
                                    </Button>
                                </Paper>
                            ) : (
                                <Paper sx={{ width: '100%' }}>
                                    <List disablePadding>
                                        {listings.map((listing, index) => (
                                            <React.Fragment key={listing.id}>
                                                <ListItem
                                                    alignItems="flex-start" // Align items to top
                                                    secondaryAction={
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, pt: 1 }}>
                                                            <Chip
                                                                label={listing.status}
                                                                color={getStatusChipColor(listing.status)}
                                                                size="small"
                                                                sx={{ mb: 1, minWidth: '70px' }}
                                                            />
                                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                <Tooltip title="View Listing">
                                                                    <IconButton size="small" onClick={() => handleViewListing(listing.id)}>
                                                                        <VisibilityIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Edit Listing">
                                                                    {/* Disable edit for Sold/Inactive? Optional */}
                                                                    <span> {/* Tooltip wrapper for disabled */}
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleEditListing(listing.id)}
                                                                            disabled={listing.status === 'Sold'}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </span>
                                                                </Tooltip>
                                                                <Tooltip title="Delete Listing">
                                                                    <IconButton size="small" color="error" onClick={() => handleOpenConfirmDialog(listing)}>
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>
                                                    }
                                                    sx={{ py: 2 }}
                                                >
                                                    <ListItemAvatar sx={{ mr: 2, mt: 1 }}>
                                                        <Avatar
                                                            variant="rounded"
                                                            src={listing.imageUrl || undefined}
                                                            alt={listing.title}
                                                            sx={{ width: 80, height: 80, bgcolor: 'grey.200' }}
                                                        >
                                                            <InventoryIcon /> {/* Fallback */}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={listing.title}
                                                        secondary={
                                                            <>
                                                                <Typography component="span" variant="body1" color="text.primary" fontWeight="bold" display="block">
                                                                    {formatCurrency(listing.price)}
                                                                </Typography>
                                                                <Typography component="span" variant="body2" color="text.secondary">
                                                                    Listed: {formatDate(listing.dateListed)}
                                                                </Typography>
                                                                {listing.quantity && listing.quantity > 1 && (
                                                                    <Typography component="span" variant="body2" color="text.secondary" display="block">
                                                                        Quantity: {listing.quantity}
                                                                    </Typography>
                                                                )}
                                                                {/* Add other details like views if available */}
                                                            </>
                                                        }
                                                        sx={{ pr: { xs: 0, sm: 15 } }} // Add padding right to avoid overlap with actions on smaller screens
                                                    />
                                                </ListItem>
                                                {index < listings.length - 1 && <Divider component="li" variant="inset" />}
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
                </Container> {/* End Main Content Container */}

                {/* Delete Confirmation Dialog */}
                <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                        <WarningIcon color="warning" sx={{ mr: 1 }} /> Delete Listing Confirmation
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete the listing "{listingToDelete?.title}"? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmDialog} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirmed}
                            color="error"
                            variant="contained"
                            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Footer />
            </Box> {/* End Page Wrapper Box */}
        </AppTheme>
    );
};

export default UserListingsPage;

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Button,
    Divider,
    Chip,
    CircularProgress,
    Alert,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Checkbox,
    Tooltip, // For better UX on buttons
} from '@mui/material';
import {
    LocationOn,
    Add,
    Edit,
    Delete,
    Home, // Default Shipping
    Business, // Default Billing
    WarningAmber, // For delete confirmation
    Save,
    Cancel,
} from '@mui/icons-material';
import Grid from '@mui/material/GridLegacy';

export interface Address {
    id: string;
    name?: string; // Optional: Name associated with the address
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefaultShipping?: boolean;
    isDefaultBilling?: boolean;
}

import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer';

// Type for the form data, excluding the ID during creation
export type AddressFormData = Omit<Address, 'id'>

// --- Mock API Functions ---

let mockAddresses: Address[] = [
    // Initial mock data
    {
        id: 'addr1',
        name: 'Jane Doe - Home',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
        isDefaultShipping: true,
        isDefaultBilling: false,
    },
    {
        id: 'addr2',
        name: 'Jane Doe - Work',
        street: '456 Business Ave',
        city: 'Workville',
        state: 'NY',
        zipCode: '67890',
        country: 'USA',
        isDefaultShipping: false,
        isDefaultBilling: true,
    },
    {
        id: 'addr3',
        name: 'Parents House',
        street: '789 Family Ln',
        city: 'Hometown',
        state: 'TX',
        zipCode: '54321',
        country: 'USA',
        isDefaultShipping: false,
        isDefaultBilling: false,
    },
];
let nextId = 4;

const fetchAddresses = async (userId: string): Promise<Address[]> => {
    console.log(`Fetching addresses for user: ${userId}`);
    // Return a copy to prevent direct mutation
    return [...mockAddresses];
};

const addAddressApi = async (userId: string, addressData: AddressFormData): Promise<Address> => {
    console.log(`Adding address for user: ${userId}`, addressData);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newAddress: Address = {
        ...addressData,
        id: `addr${nextId++}`,
    };
    // Ensure only one default shipping/billing
    if (newAddress.isDefaultShipping) {
        mockAddresses.forEach((addr) => (addr.isDefaultShipping = false));
    }
    if (newAddress.isDefaultBilling) {
        mockAddresses.forEach((addr) => (addr.isDefaultBilling = false));
    }
    mockAddresses.push(newAddress);
    return { ...newAddress }; // Return a copy
};

const updateAddressApi = async (userId: string, address: Address): Promise<Address> => {
    console.log(`Updating address ${address.id} for user: ${userId}`, address);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockAddresses.findIndex((a) => a.id === address.id);
    if (index === -1) throw new Error('Address not found');

    // Ensure only one default shipping/billing
    if (address.isDefaultShipping) {
        mockAddresses.forEach((addr) => {
            if (addr.id !== address.id) addr.isDefaultShipping = false;
        });
    }
    if (address.isDefaultBilling) {
        mockAddresses.forEach((addr) => {
            if (addr.id !== address.id) addr.isDefaultBilling = false;
        });
    }

    mockAddresses[index] = { ...address };
    return { ...address }; // Return a copy
};

const deleteAddressApi = async (userId: string, addressId: string): Promise<void> => {
    console.log(`Deleting address ${addressId} for user: ${userId}`);
    await new Promise((resolve) => setTimeout(resolve, 600));
    mockAddresses = mockAddresses.filter((a) => a.id !== addressId);
    // Note: Doesn't handle re-assigning default if a default is deleted.
    // Real backend should handle this logic (e.g., prompt user or clear default).
};

const setDefaultAddressApi = async (
    userId: string,
    addressId: string,
    type: 'shipping' | 'billing',
): Promise<Address[]> => {
    console.log(`Setting default ${type} address ${addressId} for user: ${userId}`);
    await new Promise((resolve) => setTimeout(resolve, 400));
    mockAddresses.forEach((addr) => {
        if (type === 'shipping') {
            addr.isDefaultShipping = addr.id === addressId;
        } else {
            addr.isDefaultBilling = addr.id === addressId;
        }
    });
    return [...mockAddresses]; // Return the updated list
};

// --- End Mock API Functions ---

const initialFormData: AddressFormData = {
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA', // Default country
    isDefaultShipping: false,
    isDefaultBilling: false,
};

const ManageAddressesPage: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // For form submission

    // Dialog State
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null); // null for Add, Address object for Edit
    const [formData, setFormData] = useState<AddressFormData>(initialFormData);

    // Delete Confirmation Dialog State
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

    // TODO: Replace 'user123' with the actual logged-in user ID
    const userId = 'user123';

    // Fetch initial addresses
    useEffect(() => {
        const loadAddresses = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchAddresses(userId);
                setAddresses(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load addresses.');
                console.error('Error fetching addresses:', err);
            } finally {
                setLoading(false);
            }
        };
        loadAddresses();
    }, [userId]);

    // --- Event Handlers ---

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleOpenDialog = (address: Address | null = null) => {
        setEditingAddress(address);
        setFormData(address ? { ...address } : initialFormData); // Pre-fill form if editing
        setError(null); // Clear previous form errors
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingAddress(null);
        setFormData(initialFormData); // Reset form
        setIsSubmitting(false);
    };

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null); // Clear previous errors

        try {
            let updatedAddresses;
            if (editingAddress) {
                // Update existing address
                const updatedAddress = await updateAddressApi(userId, {
                    ...formData,
                    id: editingAddress.id, // Add the ID back
                });
                updatedAddresses = addresses.map((addr) =>
                    addr.id === updatedAddress.id ? updatedAddress : addr,
                );
                // Ensure only one default after update
                if (updatedAddress.isDefaultShipping) {
                    updatedAddresses.forEach(addr => { if (addr.id !== updatedAddress.id) addr.isDefaultShipping = false; });
                }
                if (updatedAddress.isDefaultBilling) {
                    updatedAddresses.forEach(addr => { if (addr.id !== updatedAddress.id) addr.isDefaultBilling = false; });
                }

            } else {
                // Add new address
                const newAddress = await addAddressApi(userId, formData);
                updatedAddresses = [...addresses, newAddress];
                // Ensure only one default after add
                if (newAddress.isDefaultShipping) {
                    updatedAddresses.forEach(addr => { if (addr.id !== newAddress.id) addr.isDefaultShipping = false; });
                }
                if (newAddress.isDefaultBilling) {
                    updatedAddresses.forEach(addr => { if (addr.id !== newAddress.id) addr.isDefaultBilling = false; });
                }
            }
            setAddresses(updatedAddresses);
            handleCloseDialog();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save address.');
            console.error('Error saving address:', err);
            setIsSubmitting(false); // Keep dialog open on error
        }
        // No finally block for setIsSubmitting(false) here, only on error or success close
    };

    const handleOpenConfirmDialog = (address: Address) => {
        setAddressToDelete(address);
        setConfirmDialogOpen(true);
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setAddressToDelete(null);
    };

    const handleDeleteConfirmed = async () => {
        if (!addressToDelete) return;
        setIsSubmitting(true); // Use submitting state for delete operation too
        setError(null);
        try {
            await deleteAddressApi(userId, addressToDelete.id);
            setAddresses(addresses.filter((addr) => addr.id !== addressToDelete.id));
            handleCloseConfirmDialog();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete address.');
            console.error('Error deleting address:', err);
        } finally {
            setIsSubmitting(false);
            // Keep confirm dialog open on error? Or close? Closing is simpler.
            handleCloseConfirmDialog();
        }
    };

    const handleSetDefault = async (addressId: string, type: 'shipping' | 'billing') => {
        // Avoid setting default if already default
        const currentAddress = addresses.find(a => a.id === addressId);
        if (!currentAddress) return;
        if (type === 'shipping' && currentAddress.isDefaultShipping) return;
        if (type === 'billing' && currentAddress.isDefaultBilling) return;

        // Optimistic UI update (optional but good UX)
        const previousAddresses = [...addresses];
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefaultShipping: type === 'shipping' ? addr.id === addressId : addr.isDefaultShipping,
            isDefaultBilling: type === 'billing' ? addr.id === addressId : addr.isDefaultBilling,
        })));

        setError(null);
        try {
            // Call API - API should return the updated list or confirm success
            const updatedList = await setDefaultAddressApi(userId, addressId, type);
            setAddresses(updatedList); // Update state with response from API
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to set default ${type} address.`);
            console.error(`Error setting default ${type} address:`, err);
            setAddresses(previousAddresses); // Revert optimistic update on error
        }
    };


    // --- Render Logic ---

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '50%' }}>
                <Container sx={{ mt: 20, mb: 20, minWidth:"750px" }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', paddingRight: '50px'}}>
                            <LocationOn sx={{ mr: 1.5, fontSize: '2.5rem' }} /> Manage Addresses
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpenDialog()}
                            disabled={loading || isSubmitting}
                        >
                            Add New Address
                        </Button>
                    </Box>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && !dialogOpen && ( // Show general errors only when dialog is closed
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {!loading && addresses.length === 0 && !error && (
                        <Paper sx={{ p: 3, textAlign: 'center', mt: 3 }}>
                            <Typography variant="h6">No Saved Addresses</Typography>
                            <Typography color="text.secondary">
                                Add an address to speed up checkout.
                            </Typography>
                        </Paper>
                    )}

                    {!loading && addresses.length > 0 && (
                        <Paper>
                            <List disablePadding>
                                {addresses.map((address, index) => (
                                    <React.Fragment key={address.id}>
                                        <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                            <ListItemText
                                                primary={address.name || `${address.street}, ${address.city}`}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2" color="text.primary" display="block">
                                                            {address.street}
                                                        </Typography>
                                                        {`${address.city}, ${address.state} ${address.zipCode}, ${address.country}`}
                                                        <Box sx={{ mt: 1 }}>
                                                            {address.isDefaultShipping && (
                                                                <Chip icon={<Home fontSize="small" />} label="Default Shipping" size="small" color="primary" sx={{ mr: 1 }} />
                                                            )}
                                                            {address.isDefaultBilling && (
                                                                <Chip icon={<Business fontSize="small" />} label="Default Billing" size="small" color="secondary" />
                                                            )}
                                                        </Box>
                                                    </>
                                                }
                                            />
                                            <ListItemSecondaryAction sx={{ top: '30%', transform: 'translateY(-50%)', right: 16 }}>
                                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 0.5 }}>
                                                    {!address.isDefaultShipping && (
                                                        <Tooltip title="Set as Default Shipping">
                                                            <span> {/* Tooltip needs a span wrapper when button is disabled */}
                                                                <Button
                                                                    size="small"
                                                                    onClick={() => handleSetDefault(address.id, 'shipping')}
                                                                    disabled={isSubmitting}
                                                                    startIcon={<Home />}
                                                                    sx={{ mr: { sm: 1 } }}
                                                                >
                                                                    Set Default
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    )}
                                                    {!address.isDefaultBilling && (
                                                        <Tooltip title="Set as Default Billing">
                                                            <span>
                                                                <Button
                                                                    size="small"
                                                                    onClick={() => handleSetDefault(address.id, 'billing')}
                                                                    disabled={isSubmitting}
                                                                    startIcon={<Business />}
                                                                    sx={{ mr: { sm: 1 } }}
                                                                >
                                                                    Set Default
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip title="Edit Address">
                                                        <IconButton  aria-label="edit" onClick={() => handleOpenDialog(address)} disabled={isSubmitting}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Address">
                                                        <IconButton edge="end" aria-label="delete" onClick={() => handleOpenConfirmDialog(address)} disabled={isSubmitting}>
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < addresses.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    )}

                    {/* Add/Edit Address Dialog */}
                    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                        <Box component="form" onSubmit={handleFormSubmit}>
                            <DialogContent>
                                {error && ( // Show form-specific errors inside dialog
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="name"
                                            label="Address Nickname (Optional)"
                                            value={formData.name || ''}
                                            onChange={handleInputChange}
                                            fullWidth
                                            margin="dense"
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            name="street"
                                            label="Street Address"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            fullWidth
                                            margin="dense"
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            name="city"
                                            label="City"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            fullWidth
                                            margin="dense"
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            name="state"
                                            label="State / Province"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            fullWidth
                                            margin="dense"
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            name="zipCode"
                                            label="ZIP / Postal Code"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            fullWidth
                                            margin="dense"
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            name="country"
                                            label="Country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            fullWidth
                                            margin="dense"
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="isDefaultShipping"
                                                    checked={formData.isDefaultShipping || false}
                                                    onChange={handleInputChange}
                                                    disabled={isSubmitting}
                                                />
                                            }
                                            label="Set as default shipping"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="isDefaultBilling"
                                                    checked={formData.isDefaultBilling || false}
                                                    onChange={handleInputChange}
                                                    disabled={isSubmitting}
                                                />
                                            }
                                            label="Set as default billing"
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions sx={{ p: '16px 24px' }}>
                                <Button onClick={handleCloseDialog} startIcon={<Cancel />} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Address'}
                                </Button>
                            </DialogActions>
                        </Box>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
                        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                            <WarningAmber color="warning" sx={{ mr: 1 }} /> Delete Address Confirmation
                        </DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to delete the address "{addressToDelete?.name || addressToDelete?.street}"? This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseConfirmDialog} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteConfirmed}
                                color="error"
                                variant="contained"
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Delete />}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Container>
            </Box>
            <Footer />

        </AppTheme>
    );
};

export default ManageAddressesPage;
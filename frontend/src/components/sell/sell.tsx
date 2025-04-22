import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    Container,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    SelectChangeEvent,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Sell as SellIcon,
} from '@mui/icons-material';


import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer';
import { submitListingApi } from '../../api/Listings';
import { ListingFormData, Category, Condition, CreateType } from '../../types/listing';
import { useAuth } from '../../context/AuthContext';


const categories: Category[] = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion & Apparel' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'collectibles', name: 'Collectibles & Art' },
    { id: 'sports', name: 'Sporting Goods' },
    { id: 'toys', name: 'Toys & Hobbies' },
    { id: 'motors', name: 'Motors' },
    { id: 'other', name: 'Other' },
];

const conditions: Condition[] = [
    { id: 'new', name: 'New' },
    { id: 'used_like_new', name: 'Used - Like New' },
    { id: 'used_good', name: 'Used - Good' },
    { id: 'used_fair', name: 'Used - Fair' },
    { id: 'for_parts', name: 'For parts or not working' },
];


const SellItemPage: React.FC = () => {
    const { accessToken, isAuthenticated } = useAuth();


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [brand, setBrand] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isAuthenticated || !accessToken) {
            setError('You must be signed in to list an item.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        if (!title || !category || !price || !description || !brand ) {
            setError('Please fill in all required fields.');
            setIsSubmitting(false);
            return;
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            setError('Please enter a valid price.');
            setIsSubmitting(false);
            return;
        }

        const requestBody: CreateType = {
            name: title,
            description,
            price: price.toString(),
            image: null,
            type: category,
            brand: brand || '',
        };

        try {
            console.log('Sending data to API:', requestBody);
            const result = await submitListingApi(requestBody, accessToken);
            setSuccessMessage(result.message);
            setTitle('');
            setDescription('');
            setCategory('');
            setCondition('');
            setPrice('');
            setQuantity('1');
            setBrand('');
            setImageUrl('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            console.error('Listing submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const appBarHeight = 64;
    const appBarMarginTop = 0;

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppAppBar />

                <Container
                    component="main"
                    maxWidth="md"
                    sx={{
                        pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`,
                        pb: 6,
                        flexGrow: 1,
                    }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            p: { xs: 3, sm: 4, md: 5 },
                            borderRadius: 2,
                            mb: 4,
                            backgroundImage: 'none',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: theme => (
                                theme.palette.mode === 'dark'
                                    ? 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'
                                    : 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px'
                            )
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 4,
                                color: 'primary.main',
                                fontWeight: 600,
                                letterSpacing: '-0.01em'
                            }}
                        >
                            <SellIcon sx={{ mr: 2, fontSize: '2.5rem' }} /> List an Item for Sale
                        </Typography>

                        {/* Display Success/Error Messages */}
                        {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                            <Grid container spacing={4}>
                                {/* Basic Information Section */}
                                <Grid size={12}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 2,
                                            pb: 1,
                                            borderBottom: 1,
                                            borderColor: 'divider',
                                            fontWeight: 500,
                                            color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark'
                                        }}
                                    >
                                        Basic Information
                                    </Typography>
                                </Grid>

                                {/* Title */}
                                <Grid size={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="title"
                                        label="Item Title"
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={isSubmitting}
                                        variant="outlined"
                                        autoFocus

                                    />
                                </Grid>

                                {/* Description */}
                                <Grid size={14}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        name="description"
                                        multiline
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isSubmitting}
                                        variant="standard"
                                        placeholder="Describe your item in detail - include condition, features, and any other relevant information"
                                        error={!description && isSubmitting}
                                        helperText={!description && isSubmitting ? "Description is required" : ""}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Details Section */}
                                <Grid size={12}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mt: 2,
                                            mb: 2,
                                            pb: 1,
                                            borderBottom: 1,
                                            borderColor: 'divider',
                                            fontWeight: 500,
                                            color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark'
                                        }}
                                    >
                                        Item Details
                                    </Typography>
                                </Grid>

                                {/* Category */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth required disabled={isSubmitting}>
                                        <InputLabel id="category-label">Category</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            id="category"
                                            name="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            label="Category"
                                        >
                                            <MenuItem value="" disabled><em>Select a Category</em></MenuItem>
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Condition */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth required disabled={isSubmitting}>
                                        <InputLabel id="condition-label">Condition</InputLabel>
                                        <Select
                                            labelId="condition-label"
                                            id="condition"
                                            name="condition"
                                            value={condition}
                                            onChange={(e) => setCondition(e.target.value)}
                                            label="Condition"
                                        >
                                            <MenuItem value="" disabled><em>Select Condition</em></MenuItem>
                                            {conditions.map((cond) => (
                                                <MenuItem key={cond.id} value={cond.id}>{cond.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Brand (Optional) */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="brand"
                                        label="Brand"
                                        name="brand"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        disabled={isSubmitting}
                                        variant="outlined"
                                        error={!brand && isSubmitting}
                                        helperText={!brand && isSubmitting ? "Brand is required" : ""}
                                    />
                                </Grid>

                                {/* Pricing Section */}
                                <Grid size={12}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mt: 2,
                                            mb: 2,
                                            pb: 1,
                                            borderBottom: 1,
                                            borderColor: 'divider',
                                            fontWeight: 500,
                                            color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark'
                                        }}
                                    >
                                        Pricing & Quantity
                                    </Typography>
                                </Grid>

                                {/* Price */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="price"
                                        label="Price ($)"
                                        name="price"
                                        type="number"
                                        inputProps={{ step: "0.01", min: "0.01" }}
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        disabled={isSubmitting}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>$</Box>,
                                        }}
                                    />
                                </Grid>

                                {/* Quantity */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="quantity"
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        inputProps={{ step: "1", min: "1" }}
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        disabled={isSubmitting}
                                        variant="outlined"
                                    />
                                </Grid>

                                {/* Image URL Section */}
                                {/* <Grid size={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="imageUrl"
                                        label="Image URL"
                                        name="imageUrl"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        disabled={isSubmitting}
                                        variant="outlined"
                                        helperText="Enter a publicly accessible image URL"
                                    />
                                </Grid> */}

                                {/* Submit Button */}
                                <Grid size={12}>
                                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            disabled={isSubmitting}
                                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                            sx={{
                                                py: 1.5,
                                                px: 6,
                                                fontSize: '1.1rem',
                                                minWidth: '250px',
                                                fontWeight: 600,
                                                borderRadius: 1.5,
                                                background: theme => theme.palette.mode === 'dark'
                                                    ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                                                    : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    transform: 'translateY(-3px)',
                                                    boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)'
                                                },
                                                '&:active': {
                                                    transform: 'translateY(1px)',
                                                }
                                            }}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'List This Item'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Container>

                <Footer />
            </Box>
        </AppTheme>
    );
};

export default SellItemPage;

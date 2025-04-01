import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
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
    IconButton,
    Avatar, // To display image previews nicely
} from '@mui/material';
import {
    AddPhotoAlternate as AddPhotoAlternateIcon,
    Cancel as CancelIcon,
    Sell as SellIcon, // Icon for the page title
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import shared components
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import Footer from '../shared/Footer';
import { useAuth } from '../../context/AuthContext';
import { submitListingApi } from '../../api/Listings';
import { ListingFormData, Category, Condition} from '../../types/listing';

// Mock API data
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
    const navigate = useNavigate();
    const { accessToken, isAuthenticated } = useAuth(); // Get auth state if needed for API calls

    const [formData, setFormData] = useState<ListingFormData>({
        title: '',
        description: '',
        category: '',
        condition: '',
        price: '',
        quantity: '1', // Default quantity to 1
        brand: '',
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>,
    ) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setError(null); // Clear error on new file selection
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            // Basic validation (e.g., limit number of files)
            const maxFiles = 5;
            if (selectedFiles.length + filesArray.length > maxFiles) {
                setError(`You can upload a maximum of ${maxFiles} images.`);
                return;
            }

            setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);

            // Generate previews
            filesArray.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews((prevPreviews) => [...prevPreviews, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
        // Reset file input value so the same file can be selected again if removed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        // Basic validation check
        if (!formData.title || !formData.category || !formData.price) {
            setError("Please fill in all required fields.");
            setIsSubmitting(false);
            return;
        }
        if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            setError("Please enter a valid positive price.");
            setIsSubmitting(false);
            return;
        }

        // Prepare the request body
        const requestBody = {
            name: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            image: null, // Use the first image or null
            type: formData.category,
            brand: formData.brand || null,
        };

        try {
            const result = await submitListingApi(requestBody, localStorage.getItem('access_token'));
            setSuccessMessage(result.message);
            // Optionally clear form or navigate away
            setFormData({
                title: '', description: '', category: '', condition: '', price: '', quantity: '1', brand: '',
            });
            setSelectedFiles([]);
            setImagePreviews([]);
            // navigate(`/listing/${result.listingId}`); // Example navigation
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
                    maxWidth="md" // Use 'md' or 'lg' for form width
                    sx={{
                        pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, // Adjust padding top
                        pb: 6, // Padding bottom
                        flexGrow: 1,
                    }}
                >
                    <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}> {/* Add padding to Paper */}
                        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <SellIcon sx={{ mr: 1.5, fontSize: '2.5rem' }} /> List an Item for Sale
                        </Typography>

                        {/* Display Success/Error Messages */}
                        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Grid container spacing={3}>
                                {/* Title */}
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="title"
                                        label="Item Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        autoFocus
                                    />
                                </Grid>

                                {/* Description */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        name="description"
                                        multiline
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </Grid>

                                {/* Category */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required disabled={isSubmitting}>
                                        <InputLabel id="category-label">Category</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            label="Category"
                                            onChange={handleInputChange}
                                        >
                                            <MenuItem value="" disabled><em>Select a Category</em></MenuItem>
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Condition */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required disabled={isSubmitting}>
                                        <InputLabel id="condition-label">Condition</InputLabel>
                                        <Select
                                            labelId="condition-label"
                                            id="condition"
                                            name="condition"
                                            value={formData.condition}
                                            label="Condition"
                                            onChange={handleInputChange}
                                        >
                                            <MenuItem value="" disabled><em>Select Condition</em></MenuItem>
                                            {conditions.map((cond) => (
                                                <MenuItem key={cond.id} value={cond.id}>{cond.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Price */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="price"
                                        label="Price ($)"
                                        name="price"
                                        type="number" // Use number type for better input control
                                        inputProps={{ step: "0.01", min: "0.01" }} // Allow decimals, enforce positive
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </Grid>

                                {/* Quantity */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="quantity"
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        inputProps={{ step: "1", min: "1" }} // Whole numbers, positive
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </Grid>

                                {/* Brand (Optional) */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="brand"
                                        label="Brand (Optional)"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </Grid>

                                {/* Image Upload */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>Images (Required, max 5)</Typography>
                                    {/* Hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*" // Accept only image files
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        id="image-upload-input"
                                        disabled={isSubmitting}
                                    />
                                    {/* Button to trigger file input */}
                                    <label htmlFor="image-upload-input">
                                        <Button
                                            variant="outlined"
                                            component="span" // Makes the button act like a label trigger
                                            startIcon={<AddPhotoAlternateIcon />}
                                            disabled={isSubmitting || selectedFiles.length >= 5}
                                            sx={{ mb: 2 }}
                                        >
                                            Add Images
                                        </Button>
                                    </label>

                                    {/* Image Previews */}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        {imagePreviews.map((previewUrl, index) => (
                                            <Box key={index} sx={{ position: 'relative' }}>
                                                <Avatar
                                                    variant="rounded"
                                                    src={previewUrl}
                                                    alt={`Preview ${index + 1}`}
                                                    sx={{ width: 100, height: 100 }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveImage(index)}
                                                    disabled={isSubmitting}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -5,
                                                        right: -5,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                        },
                                                    }}
                                                >
                                                    <CancelIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>


                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        disabled={isSubmitting}
                                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                        sx={{ mt: 2, py: 1.5 }} // Add some margin top and padding
                                    >
                                        {isSubmitting ? 'Submitting Listing...' : 'List Item'}
                                    </Button>
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

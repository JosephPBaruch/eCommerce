import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
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
  Avatar,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';

import {
  Edit as EditIcon, // Icon for page title
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Cancel as CancelIcon, // Icon for removing images
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  DeleteForever as DeleteForeverIcon, // Icon for deleting existing images
} from '@mui/icons-material';

// Import shared components & context
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared//AppAppBar'; 
import Footer from '../shared/Footer'; 
import { useAuth } from '../../context/AuthContext';

// Import types
import { ListingImageData, ListingEditFormData } from '../../types/listing';
import { fetchListingForEdit, updateListingApi } from '../../api/Listings';

// --- Mock Data (Categories/Conditions - reuse from SellItemPage or fetch) ---
const categories = [ { id: 'electronics', name: 'Electronics' }, /* ... other categories */ ];
const conditions = [ { id: 'new', name: 'New' }, /* ... other conditions */ ];
const MAX_IMAGES = 5;

// --- Mock API Functions ---
// Replace with your actual API calls

// // Fetch listing details specifically for editing (might be same as view endpoint)
// const fetchListingForEdit = async (
//     listingId: string,
//     accessToken: string | null
// ): Promise<ListingDetails | null> => {
//   console.log(`Fetching listing ${listingId} for editing`);
//   // Add Authorization header: headers: { 'Authorization': `Bearer ${accessToken}` }
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   // Simulate not found or not authorized (backend should check ownership)
//   if (listingId === 'not-found' || listingId === 'unauthorized') {
//     return null;
//   }

//   // Return mock data matching ListingDetails
//    const mockImages: ListingImageData[] = [
//     { id: 'img1', url: '/path/to/headphones_large.jpg' }, // Replace
//     { id: 'img2', url: '/path/to/headphones_side.jpg' }, // Replace
//   ];
//   const mockSeller = { id: 'user123', username: 'CurrentUser' }; // Simulate owned by current user

//   return {
//     id: listingId,
//     title: 'Editable Wireless Headphones',
//     description: "Good condition, works perfectly. Selling because I upgraded.",
//     price: 55.00,
//     category: { id: 'electronics', name: 'Electronics' },
//     condition: { id: 'used_good', name: 'Used - Good' },
//     status: 'Active',
//     dateListed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
//     images: mockImages,
//     quantity: 1,
//     brand: 'AudioPhile',
//     seller: mockSeller,
//   };
// };

// // Update the listing
// const updateListingApi = async (
//   listingId: string,
//   updateData: globalThis.FormData, // Use FormData for potential file uploads
//   accessToken: string | null,
// ): Promise<{ success: boolean; message: string; listingId: string }> => {
//   console.log(`Updating listing ${listingId}...`);
//   // Log FormData entries (for debugging)
//   for (let pair of updateData.entries()) {
//     console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
//   }
//   // Add Authorization header: headers: { 'Authorization': `Bearer ${accessToken}` }
//   await new Promise((resolve) => setTimeout(resolve, 1500));

//   // --- Replace with actual fetch (likely PUT or PATCH) ---
//   // const response = await fetch(`/api/listings/${listingId}`, {
//   //   method: 'PUT', // or 'PATCH'
//   //   headers: { 'Authorization': `Bearer ${accessToken}` },
//   //   body: updateData,
//   // });
//   // if (!response.ok) { /* Handle error */ }
//   // const result = await response.json();
//   // return { success: true, message: 'Listing updated successfully!', listingId: result.id };
//   // --- End Replace ---

//   // Simulate success/failure
//   if (Math.random() > 0.1) {
//     return { success: true, message: 'Listing updated successfully!', listingId: listingId };
//   } else {
//     throw new Error('Failed to update listing. Please try again.');
//   }
// };
// --- End Mock API Functions ---


const EditListingPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { accessToken, uid } = useAuth(); // Get token and user ID

  // Form state
  const [formData, setFormData] = useState<Partial<ListingEditFormData>>({}); // Start empty, populate from fetch

  // Image states
  const [existingImages, setExistingImages] = useState<ListingImageData[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // Store IDs of images marked for deletion
  const [newlySelectedFiles, setNewlySelectedFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Component states
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false); // Track if current user owns the listing

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch existing listing data
  useEffect(() => {
    if (!listingId) {
      setError('Listing ID is missing.');
      setLoading(false);
      return;
    }
    if (!accessToken) {
        setError('You must be logged in to edit listings.');
        setLoading(false);
        // Optionally redirect: navigate('/signin');
        return;
    }

    const loadListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchListingForEdit(listingId, accessToken);
        if (data) {
          // --- Authorization Check (Frontend) ---
          // IMPORTANT: Backend MUST perform the definitive authorization check
          if (data.seller.id !== uid) { // Compare fetched seller ID with logged-in user ID
             setError("You are not authorized to edit this listing.");
             setIsOwner(false);
             setLoading(false);
             return;
          }
          setIsOwner(true);
          // --- Populate Form ---
          setFormData({
            title: data.title,
            description: data.description,
            category: data.category.id,
            condition: data.condition.id,
            price: data.price.toString(), // Convert number to string for input
            quantity: data.quantity.toString(), // Convert number to string
            brand: data.brand || '',
          });
          setExistingImages(data.images || []);
          setImagesToDelete([]); // Reset deletion list
          setNewlySelectedFiles([]); // Reset new files
          setNewImagePreviews([]); // Reset new previews
        } else {
          setError(`Listing with ID "${listingId}" not found or you don't have permission to edit it.`);
           setIsOwner(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing details.');
        console.error('Error fetching listing details:', err);
         setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [listingId, accessToken, uid, navigate]); // Dependencies

  // --- Event Handlers ---
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
    setError(null);
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const currentTotalImages = existingImages.length - imagesToDelete.length + newlySelectedFiles.length;

      if (currentTotalImages + filesArray.length > MAX_IMAGES) {
          setError(`You can have a maximum of ${MAX_IMAGES} images in total.`);
          // Clear the file input
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
      }

      setNewlySelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);

      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImagePreviews((prevPreviews) => [...prevPreviews, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
     if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    setNewlySelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    setNewImagePreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  const handleMarkExistingImageForDeletion = (imageId: string) => {
    // Prevent deleting last image if no new ones are added? Optional rule.
    // const remainingImages = existingImages.length - (imagesToDelete.length + 1) + newlySelectedFiles.length;
    // if (remainingImages < 1) {
    //     setError("You must have at least one image.");
    //     return;
    // }
    setImagesToDelete((prev) => [...prev, imageId]);
  };

   const handleUnmarkExistingImageForDeletion = (imageId: string) => {
    setImagesToDelete((prev) => prev.filter(id => id !== imageId));
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOwner) {
        setError("Cannot submit: You are not authorized to edit this listing.");
        return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // --- Validation ---
    const currentTotalImages = existingImages.length - imagesToDelete.length + newlySelectedFiles.length;
    if (currentTotalImages === 0) {
        setError("Please add at least one image.");
        setIsSubmitting(false);
        return;
    }
    // Add other validation as in SellItemPage (price, quantity etc.)
    if (!formData.title || !formData.category || !formData.condition || !formData.price) {
        setError("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
    }
     if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        setError("Please enter a valid positive price.");
        setIsSubmitting(false);
        return;
    }
     if (isNaN(parseInt(formData.quantity || '0', 10)) || parseInt(formData.quantity || '0', 10) < 0) {
        setError("Please enter a valid quantity (0 or more).");
        setIsSubmitting(false);
        return;
    }
    // --- End Validation ---


    const updateData = new FormData();
    // Append text fields that have been potentially changed
    Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) { // Ensure value exists
             updateData.append(key, value as string);
        }
    });

    // Append IDs of images to delete (backend needs to handle this)
    if (imagesToDelete.length > 0) {
        // Send as JSON string or individual params depending on backend
        updateData.append('deleted_image_ids', JSON.stringify(imagesToDelete));
        // Or loop: imagesToDelete.forEach(id => updateData.append('deleted_image_ids[]', id));
    }

    // Append newly added files
    newlySelectedFiles.forEach((file) => {
      updateData.append('new_images', file); // Key 'new_images' for backend to identify
    });

    try {
      if (!listingId) throw new Error("Listing ID is missing"); // Should not happen if loaded
      const result = await updateListingApi(listingId, updateData, accessToken);
      setSuccessMessage(result.message);
      // Refresh data after successful update
      setImagesToDelete([]); // Clear deletion list
      setNewlySelectedFiles([]);
      setNewImagePreviews([]);
      // Optionally navigate away or refetch data to show final state
      // navigate(`/listing/${result.listingId}`);
      // Or trigger a refetch of the listing data here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during update.');
      console.error('Listing update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estimate AppBar height
  const appBarHeight = 64;
  const appBarMarginTop = 28;

  // --- Render Logic ---

  if (loading) { /* ... Loading Spinner ... */
     return (
       <AppTheme>
         <CssBaseline enableColorScheme />
         <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
           <AppAppBar />
           <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, pb: 6 }}>
             <CircularProgress />
           </Container>
           <Footer />
         </Box>
       </AppTheme>
    );
  }

  // Show error/unauthorized message prominently if not owner or fetch failed
  if (error || !isOwner) { /* ... Error Alert ... */
     return (
       <AppTheme>
         <CssBaseline enableColorScheme />
         <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
           <AppAppBar />
           <Container component="main" maxWidth="md" sx={{ pt: `${(appBarHeight + appBarMarginTop) / 8 + 4}rem`, pb: 6, flexGrow: 1 }}>
             <Alert severity="error" action={
                <Button color="inherit" size="small" onClick={() => navigate('/')}>
                    Go Home
                </Button>
             }>
                {error || "You are not authorized to edit this listing."}
             </Alert>
           </Container>
           <Footer />
         </Box>
       </AppTheme>
    );
  }

  // --- Main Form Render (only if loading is false, no error, and isOwner is true) ---
  const currentTotalImages = existingImages.length - imagesToDelete.length + newlySelectedFiles.length;

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
           <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
              Back
           </Button>

          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <EditIcon sx={{ mr: 1.5, fontSize: '2.5rem' }} /> Edit Listing
            </Typography>

            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} {/* Show submit errors here */}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                {/* Form Fields (similar to SellItemPage, but using formData state) */}
                <Grid item xs={12}>
                  <TextField required fullWidth label="Item Title" name="title" value={formData.title || ''} onChange={handleInputChange} disabled={isSubmitting} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Description" name="description" multiline rows={4} value={formData.description || ''} onChange={handleInputChange} disabled={isSubmitting} />
                </Grid>
                 <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required disabled={isSubmitting}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select labelId="category-label" name="category" value={formData.category || ''} label="Category" onChange={handleInputChange}>
                      {categories.map((cat) => (<MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>
                 <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required disabled={isSubmitting}>
                    <InputLabel id="condition-label">Condition</InputLabel>
                    <Select labelId="condition-label" name="condition" value={formData.condition || ''} label="Condition" onChange={handleInputChange}>
                      {conditions.map((cond) => (<MenuItem key={cond.id} value={cond.id}>{cond.name}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>
                 <Grid item xs={12} sm={6}>
                  <TextField required fullWidth label="Price ($)" name="price" type="number" inputProps={{ step: "0.01", min: "0.01" }} value={formData.price || ''} onChange={handleInputChange} disabled={isSubmitting} />
                </Grid>
                 <Grid item xs={12} sm={6}>
                  <TextField required fullWidth label="Quantity" name="quantity" type="number" inputProps={{ step: "1", min: "0" }} value={formData.quantity || ''} onChange={handleInputChange} disabled={isSubmitting} />
                </Grid>
                 <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Brand (Optional)" name="brand" value={formData.brand || ''} onChange={handleInputChange} disabled={isSubmitting} />
                </Grid>

                {/* Image Management Section */}
                <Grid item xs={12}>
                   <Typography variant="subtitle1" gutterBottom>Manage Images (Max {MAX_IMAGES})</Typography>
                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, p: 1, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                      {/* Existing Images */}
                      {existingImages.map((img) => {
                         const isMarkedForDeletion = imagesToDelete.includes(img.id);
                         return (
                            <Box key={img.id} sx={{ position: 'relative', opacity: isMarkedForDeletion ? 0.4 : 1 }}>
                                <Avatar
                                   variant="rounded"
                                   src={img.url}
                                   alt={`Existing image ${img.id}`}
                                   sx={{ width: 100, height: 100 }}
                                />
                                <Tooltip title={isMarkedForDeletion ? "Undo Delete" : "Mark for Deletion"}>
                                   <IconButton
                                      size="small"
                                      onClick={() => isMarkedForDeletion ? handleUnmarkExistingImageForDeletion(img.id) : handleMarkExistingImageForDeletion(img.id)}
                                      disabled={isSubmitting}
                                      color={isMarkedForDeletion ? "warning" : "error"}
                                      sx={{
                                         position: 'absolute', top: -5, right: -5,
                                         backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                         '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                                      }}
                                   >
                                      {isMarkedForDeletion ? <CancelIcon fontSize="small" /> : <DeleteForeverIcon fontSize="small" />}
                                   </IconButton>
                                </Tooltip>
                            </Box>
                         );
                      })}
                      {/* New Image Previews */}
                      {newImagePreviews.map((previewUrl, index) => (
                         <Box key={`new-${index}`} sx={{ position: 'relative' }}>
                            <Avatar
                               variant="rounded"
                               src={previewUrl}
                               alt={`New preview ${index + 1}`}
                               sx={{ width: 100, height: 100 }}
                            />
                            <Tooltip title="Remove New Image">
                               <IconButton
                                  size="small"
                                  onClick={() => handleRemoveNewImage(index)}
                                  disabled={isSubmitting}
                                  sx={{
                                     position: 'absolute', top: -5, right: -5,
                                     backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                     '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                                  }}
                               >
                                  <CancelIcon fontSize="small" />
                               </IconButton>
                            </Tooltip>
                         </Box>
                      ))}
                   </Box>
                   {/* Add Images Button */}
                   <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="image-upload-input" disabled={isSubmitting} />
                   <label htmlFor="image-upload-input">
                      <Button
                         variant="outlined"
                         component="span"
                         startIcon={<AddPhotoAlternateIcon />}
                         disabled={isSubmitting || currentTotalImages >= MAX_IMAGES}
                      >
                         Add New Images ({currentTotalImages}/{MAX_IMAGES})
                      </Button>
                   </label>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting || !isOwner} // Disable if submitting or not owner
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
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

export default EditListingPage;

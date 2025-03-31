import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { getAccessToken } from '../types';

export function Search() {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  );
}

export default function SellMain() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     const token = getAccessToken();
          if (!token) {
            console.error('No access token found');
            return;
          }
    
          try {
            fetch('http://localhost:8080/products/', {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(formData)
            });
          } catch (error) {
            console.error('Error fetching products:', error);
          }
    setFormData({ name: '', description: '', price: '' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {/* Title Section */}
      <div>
        <Typography variant="h1" gutterBottom>
          Sell
        </Typography>
        <Typography>List your products for sale</Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">Add a Product</Typography>
        <OutlinedInput
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
        />
        <OutlinedInput
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Product Description"
          multiline
          rows={3}
          required
        />
        <OutlinedInput
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Product Price"
          type="number"
          required
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Add Product
          </button>
        </Box>
      </Box>
    </Box>
  );
}
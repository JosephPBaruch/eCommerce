import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { ListingCardData, Category } from '../../types/listing';
import { fetchActiveListings } from '../../api/Listings';
import Grid from '@mui/material/GridLegacy';





const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home' },
  { id: 'toys', name: 'Toys' },
  { id: 'other', name: 'Other' },

];
const ALL_CATEGORIES_ID = 'all';


const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: '2.5em',
});


interface SearchProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}


export function Search({ value, onChange }: SearchProps) {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search listings…"
        value={value}
        onChange={onChange}
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'Search listings',
        }}
      />
    </FormControl>
  );
}


const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};


export default function MainContent() {
  const [allListings, setAllListings] = useState<ListingCardData[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>(categories);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ALL_CATEGORIES_ID);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();


  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const listingsData = await fetchActiveListings();
        setAllListings(listingsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load initial data.');
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadListings();
  }, []);


  const filteredListings = useMemo(() => {
    let listingsToFilter = allListings;


    if (selectedCategoryId !== ALL_CATEGORIES_ID) {
      listingsToFilter = listingsToFilter.filter(
        listing => listing.categoryId === selectedCategoryId
      );
    }


    if (searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      listingsToFilter = listingsToFilter.filter(listing =>
        listing.title.toLowerCase().includes(lowerCaseSearchTerm)


      );
    }

    return listingsToFilter;
  }, [allListings, selectedCategoryId, searchTerm]);


  const handleCardClick = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };


  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  const getEmptyMessage = () => {
    let message = "No listings found";
    if (selectedCategoryId !== ALL_CATEGORIES_ID) {
      const categoryName = categoriesData.find(c => c.id === selectedCategoryId)?.name || 'the selected category';
      message += ` in ${categoryName}`;
    }
    if (searchTerm.trim() !== '') {
      message += ` matching "${searchTerm}"`;
    }
    return message + ".";
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Title Section */}
      <div>
        <Typography variant="h1" gutterBottom>
          Store
        </Typography>
      </div>

      {/* Search Bar/Product Filters */}
      {/* Mobile Search */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none', pl: 30 },

        }}
      >
        <Search value={searchTerm} onChange={handleSearchChange} /> {/* Pass props */}
      </Box>
      <Box
        sx={{ display: 'flex' }}
      >
        {/* Category Chips */}
        <Box
          sx={{}}
        >
          {categoriesData.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              size="medium"
              onClick={() => handleCategoryClick(category.id)}
              variant={selectedCategoryId === category.id ? 'filled' : 'outlined'}
              color={selectedCategoryId === category.id ? 'primary' : 'default'}
              clickable
            />
          ))}
        </Box>
        {/* Desktop Search */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex', pl: 30, justifySelf: 'end' },
          }}
        >
          <Search value={searchTerm} onChange={handleSearchChange} />
        </Box>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ my: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid - Render filteredListings */}
      {!loading && !error && (
        <Grid container spacing={2} columns={12}>
          {filteredListings.length === 0 ? (
            <Grid item xs={12}>
              <Typography sx={{ textAlign: 'center', mt: 4 }}>
                {getEmptyMessage()} {/* Use dynamic empty message */}
              </Typography>
            </Grid>
          ) : (
            filteredListings.map((listing, index) => (
              <Grid item key={listing.id} xs={12} sm={6} md={4} lg={3}>
                <StyledCard variant="outlined">
                  <CardActionArea onClick={() => handleCardClick(listing.id)}>
                    <CardMedia
                      component="img"
                      alt={listing.title}
                      image={listing.imageUrl || `https://picsum.photos/400/300?random=${index + 1}`}
                    />
                    <StyledCardContent>
                      <StyledTypography gutterBottom variant="h6" as="div">
                        {listing.title} {/* Updated to display title */}
                      </StyledTypography>
                      <Typography variant="body1" color="primary" fontWeight="bold">
                        {formatCurrency(listing.price)}
                      </Typography>
                    </StyledCardContent>
                  </CardActionArea>
                </StyledCard>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
}


import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const tempProducts = [
  {
    img: 'https://picsum.photos/800/450?random=1',
    tag: 'Product1',
    title: 'Product # 1',
    description:
      'Product Description.',
  },
  {
    img: 'https://picsum.photos/800/450?random=2',
    tag: 'Product2',
    title: 'Product # 2',
    description:
      'Product Description.',
  },
  {
    img: 'https://picsum.photos/800/450?random=3',
    tag: 'Product3',
    title: 'Product # 3',
    description:
      'Product Description.',
  },
  {
    img: 'https://picsum.photos/800/450?random=4',
    tag: 'Product4',
    title: 'Product # 4',
    description:
      'Product Description.',
  },
  {
    img: 'https://picsum.photos/800/450?random=45',
    tag: 'Product5',
    title: 'Product # 5',
    description:
      'Product Description.',
  },
  {
    img: 'https://picsum.photos/800/450?random=6',
    tag: 'Product6',
    title: 'Product # 6,',
    description:
      'Product Description.',
  },
];

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
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
});

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

export default function MainContent() {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null,
  );

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleClick = () => {
    console.info('You clicked the filter chip.');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Title Section */}
      <div>
        <Typography variant="h1" gutterBottom>
          Sell
        </Typography>
      </div>
      {/* Title Section */}
      {/* Products */}
      <Grid2 container spacing={2} columns={12}>
        <Typography>Coming soon</Typography>
      </Grid2>
    </Box>
  );
}

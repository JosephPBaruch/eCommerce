import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="h1" gutterBottom>
            Sell
        </Typography>
        <Grid2 container spacing={2} columns={12}>
            <Typography>Coming soon</Typography>
        </Grid2>
    </Box>
  );
}

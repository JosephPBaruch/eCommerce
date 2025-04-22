import { styled, alpha } from '@mui/material/styles';
import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Tooltip from '@mui/material/Tooltip';
import ColorModeIconDropdown from '../../theme/ColorModeIconDropdown';
import { SitemarkIcon } from '../shared/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const StyledToolbar = styled(Toolbar)(({ theme }: { theme: any }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };


  const iconButtonStyle = {
    p: 0,
    border: 'none',
    outline: 'none',
    '&:focus': {
      outline: 'none',
      backgroundColor: 'transparent',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  };


  const iconSize = '1.8rem';

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" >
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{ ...iconButtonStyle, mr: 5, ml: 3, fontSize: iconSize }}
              aria-label="Go to homepage"
            >
              <SitemarkIcon />
            </IconButton>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button onClick={() => navigate('/')} variant="text" color="info" size="small">
                Buy
              </Button>
              <Button onClick={() => navigate('/sell')} variant="text" color="info" size="small">
                Sell
              </Button>
            </Box>
          </Box>

          {/* Desktop Auth Section */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {isAuthenticated ? (
              <>
                <Tooltip title="Cart">
                  <IconButton
                    color="primary"
                    onClick={() => handleNavigate('/cart')}
                    size="small"
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Profile">
                  <IconButton
                    color="primary"
                    onClick={() => handleNavigate('/profile')}
                    size="small"
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
                <Button color="primary" variant="text" size="small" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  onClick={() => handleNavigate('/signin')}
                >
                  Sign in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => handleNavigate('/signup')}
                >
                  Sign up
                </Button>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>

          {/* Mobile Menu Section */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                  minWidth: '300px',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <IconButton
                    onClick={() => handleNavigate('/')}
                    sx={{ ...iconButtonStyle, fontSize: iconSize }}
                    aria-label="Go to homepage"
                  >
                    <SitemarkIcon />
                  </IconButton>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                {/* Mobile Nav Links */}
                <MenuItem onClick={() => handleNavigate('/')}>Buy</MenuItem>
                <MenuItem onClick={() => handleNavigate('/sell')}>Sell</MenuItem>

                <Divider sx={{ my: 2 }} />

                {/* Mobile Auth Links */}
                {isAuthenticated ? (
                  <>
                    <MenuItem onClick={() => handleNavigate('/cart')}>
                      <Button
                        color="primary"
                        variant="text"
                        fullWidth
                        startIcon={<ShoppingCartIcon />}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        Cart
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/profile')}>
                      <Button
                        color="primary"
                        variant="text"
                        fullWidth
                        startIcon={<AccountCircle />}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        Profile
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Button color="primary" variant="contained" fullWidth>
                        Logout
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => handleNavigate('/signup')}>
                      <Button color="primary" variant="contained" fullWidth>
                        Sign up
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/signin')}>
                      <Button color="primary" variant="outlined" fullWidth>
                        Sign in
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import AppTheme from '../../theme/AppTheme';
// import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../shared/icons';
import {  SitemarkIcon } from '../shared/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // <-- Import useAuth
import Alert from '@mui/material/Alert'; // <-- Import Alert for errors
import CircularProgress from '@mui/material/CircularProgress'; // <-- Import for loading
// import { ThemedContainer } from '../../theme/themePrimitives';
import AppAppBar from '../shared/AppAppBar';
import Container from '@mui/material/Container';



// --- Styled components (Card, SignInContainer) remain the same ---
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));


// --- End Styled components ---

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false); // Local submitting state

  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth(); // <-- Use the auth context

  React.useEffect(() => {
    // Clear auth errors when component mounts or unmounts
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = () => {
    // Clear previous validation errors
    setEmailError(false);
    setEmailErrorMessage('');
    setPasswordError(false);
    setPasswordErrorMessage('');

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById(
      'password',
    ) as HTMLInputElement;
    const email = emailInput?.value;
    const password = passwordInput?.value;

    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError(); // Clear previous auth errors

    if (!validateInputs()) {
      return; // Stop submission if validation fails
    }

    setIsSubmitting(true); // Start submitting indicator

    const data = new FormData(event.currentTarget);
    const userData = {
      // Ensure backend expects 'username' 
      // Or change to 'email' if the backend expects 'email'
      username: data.get('email'),
      password: data.get('password'),
    };

    try {
      // -------------- Real Api Request -----------------------------
      const response = await fetch('http://127.0.0.1:8080/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json(); // Try to parse JSON regardless of status

      if (!response.ok) {
        // Handle specific API errors (e.g., invalid credentials)
        const errorMessage =
          result?.detail || // Common key for DRF errors
          result?.error || // Generic error key
          `Login failed (Status: ${response.status})`;
        throw new Error(errorMessage);
      }

      if (result.access) {
        // Use the login function from AuthContext
        login(result.access);
        console.log('User logged in via component!');
        navigate('/'); // Navigate to home page on successful login
      } else {
        // Handle cases where tokens are missing in a 2xx response (unexpected)
        throw new Error('Login successful, but tokens were not received.');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login Error:', error);
      // Set the error state in the AuthContext (or handle locally if preferred)
      // For now, display it locally using Alert
      setEmailError(true); // Indicate error on fields potentially
      setPasswordError(true);
      // display the authError from context below
      
    } finally {
      setIsSubmitting(false); // Stop submitting indicator
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar></AppAppBar>
      <Container sx={{my: 30}}>
        <Card variant="outlined">
          <Button onClick={() => navigate('/')}>
            <SitemarkIcon />
          </Button>

          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>

          {/* Display Authentication Errors */}
          {authError && (
            <Alert severity="error" onClose={clearError}>
              {authError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate // Keep noValidate, handle validation manually
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                disabled={isSubmitting} // Disable during submission
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                // autoFocus // Remove second autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                disabled={isSubmitting} // Disable during submission
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              disabled={isSubmitting}
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting} // Disable button during submission
              // Remove onClick={validateInputs} - validation happens in handleSubmit
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Signing In...' : 'Sign in'}
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
              disabled={isSubmitting}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
              disabled={isSubmitting}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
              disabled={isSubmitting}
            >
              Sign in with Facebook
            </Button> */}
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link
                // Use React Router Link or navigate for internal navigation
                onClick={() => navigate('/signup')}
                component="button" // Make it behave like a button for onClick
                variant="body2"
                sx={{ alignSelf: 'center' }}
                disabled={isSubmitting}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </AppTheme>
  );
}

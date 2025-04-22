import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    fetch('/users/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((response) => {
      if (response.ok) {
        console.log('User created!');
        loginUser(username, password);
      } else {

        console.error('Registration failed:', response.status, response.statusText);
        response.json().then(data => console.error('Error details:', data)).catch(() => { });
      }
    }).catch(error => {
      console.error('Error during registration request:', error);
    });
  };

  const loginUser = (username: string, password: string) => {

    fetch('/users/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((response) => {
      if (!response.ok) {

        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
      .then((data) => {
        if (data.access && data.refresh) {
          auth.login({ access: data.access, refresh: data.refresh });
          console.log('User logged in via context!');
          navigate('/');
        } else if (data.access) {
          console.warn('Login endpoint only returned access token.');
          auth.login({ access: data.access, refresh: '' });
          navigate('/');
        } else {
          console.error('Login failed: No access token received.', data);
        }
      }).catch(error => {
        console.error('Error during login request:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h1">Create User</Typography>
      <form>
        <div>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button onClick={onClick} type="submit" variant="contained" color="primary">
          Create User
        </Button>
      </form>
    </Container>
  );
}

export default CreateUser;
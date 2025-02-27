import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetch('http://127.0.0.1:8080/users/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((response) => {
      if (response.ok) {
        console.log('User created!');
        loginUser(username, password);
      }
    });
  };

  const products = () => {
    const accessToken = localStorage.getItem('access_token');

    fetch('http://127.0.0.1:8080/products/products/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }).then((response) => {
      if (response.ok) {
        console.log(response.json())
        return response.json();
      }
    }).then((data) => {
      console.log(data);
    });
  }

  const loginUser = (username: string, password: string) => {
    fetch('http://127.0.0.1:8080/users/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((response) => response.json())
      .then((data) => {
        if (data.access) {
          // Store the access token securely
          localStorage.setItem('access_token', data.access);
          console.log('User logged in!');
          products()
        }
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
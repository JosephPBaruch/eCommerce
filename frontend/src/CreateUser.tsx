import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
// import './App.css';

function CreateUser() {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetch('http://127.0.0.1:8080/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((response) => {
      if (response.ok) {
        console.log('User created!');
      }
    });
  };

  return (
    <Container>
      <Typography variant="h1">Create User</Typography>
      <form>
        <div>
          <TextField
            label="username"
            variant="outlined"
            value={username}
            onChange={(e) => setusername(e.target.value)}
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

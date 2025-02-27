// import { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';

function CreateUser() {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const accessToken = localStorage.getItem('access_token');

    event.preventDefault();
    fetch('http://127.0.0.1:8080/products/products/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            name: 'name',
            description: 'description',
            price: 12,
          })
      }).then((response) => {
        if (response.ok) {
          console.log(response)
          return response.json();
        }
      }).then((data) => {
        console.log(data);
      });
  };

  return (
    <Container>
      <Typography variant="h1">Create Product</Typography>
      <form>
        <div>
          <h2>All inputs complete </h2>
        </div>
        <Button onClick={onClick} type="submit" variant="contained" color="primary">
         Go
        </Button>
      </form>
    </Container>
  );
}

export default CreateUser;
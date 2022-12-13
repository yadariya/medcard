import { useState, useEffect } from 'react';

import { address as localAddress } from '../web3';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';

import { useNavigate } from 'react-router';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    localAddress
      .then(() => new Promise((resolve, _) => setTimeout(resolve, 1000)))
      .then(() => navigate('/generator'));
  }, []);

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Typography component="h1" variant="h4" align="center">
        Connecting to MetaMask...
      </Typography>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <LinearProgress />
      </Paper>
    </Stack>
  );
}

export default App;

import { useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import { address as localAddress, generator } from '../web3';
import { useMyAddress } from './utils';
import { RSA } from '../web3/crypto';

function Generator() {
  const navigate = useNavigate();
  const myAddress = useMyAddress();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const openOwner = useCallback(() => {
    setLoading(true);
    (async () => {
      try {
        let card = await generator.card(await localAddress);

        if (card == null) {
          card = await generator.createCard();
        }

        if (card == null) {
          throw 'error';
        }

        navigate(`/owner/${card.address}`);
      } catch (e) {
        alert("Cannot get or create card");
        setLoading(false);
      }
    })();
  }, [navigate]);

  const openDoctor = useCallback(() => {
    setLoading(true);
    (async () => {
      try {
        let card = await generator.card(address);

        if (card == null) {
          throw 'error';
        }

        navigate(`/doctor/${card.address}`);
      } catch (e) {
        alert("Cannot get card");
        setLoading(false);
      }
    })();
  }, [navigate, address]);

  const [pubkey, setPubkey] = useState(null);

  useEffect(() => {
    if (myAddress) {
      setPubkey(null);
      RSA.getKey(myAddress).then(([_, pub]) => setPubkey(pub));
    }
  }, [myAddress]);

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Typography component="h1" variant="h4" align="center">
        Open Medical Card
      </Typography>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <LoadingButton
          variant="contained"
          onClick={openOwner}
          fullWidth
          loading={loading}
        >Open or Create Your Medical Card</LoadingButton>
      </Paper>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={{ xs: 2, md: 3 }}>
          <TextField
            label="Medical Card Owner"
            variant="filled"
            onChange={(event) => setAddress(event.target.value)}
            fullWidth
            value={address}
          />
          <LoadingButton
            variant="contained"
            onClick={openDoctor}
            fullWidth
            loading={loading}
          >Open Medical Card as Doctor</LoadingButton>
        </Stack>
      </Paper>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={{ xs: 2, md: 3 }}>
          <TextField
              label="Your Address"
              variant="filled"
              value={myAddress || ''}
              fullWidth
              aria-disabled
            />
          <TextField
              label="Your Public Key"
              variant="filled"
              value={pubkey || ''}
              fullWidth
              aria-disabled
            />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default Generator;

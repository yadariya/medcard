import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import { MedicalCard } from '../web3';

function Generator() {
  const { address } = useParams();
  const contract = useMemo(() => new MedicalCard(address), [address]);

  const [pages, setPages] = useState(null);

  useEffect(() => {
    contract.pages().then(setPages);
  }, [contract]);

  const [docAddress, setDocAddress] = useState('');
  const [docPubkey, setDocPubkey] = useState('');
  const [loading, setLoading] = useState(false);

  const request = useCallback(async () => {
    setLoading(true);
    const links = pages.filter(p => p.done && p.top);
    try {
      await contract.request(docAddress, docPubkey, links);
      try {
        await contract.pages().then(setPages);
        setLoading(false);
      } catch (e) {
        alert("Can't reload pages");
      }
    } catch (e) {
      alert("Can't create page");
    }
  }, [contract, docAddress, docPubkey, pages]);

  if (pages === null) {
    return (
      <Stack spacing={{ xs: 2, md: 3 }}>
        <Typography component="h1" variant="h4" align="center">
          Medical Card
        </Typography>
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          {address}
        </Paper>
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <LinearProgress />
        </Paper>
      </Stack>
    );
  }

  const cards = pages.map(p => {
    let title, subtitle = `id ${p.id}, doc ${p.doctor}`, content;
    if (p.responseTimestamp) {
      title = `${p.requestTimestamp.toLocaleString()} - ${p.responseTimestamp.toLocaleString()}`;
      content = <CardContent>
        {p.response}
      </CardContent>;
    } else {
      title = `${p.requestTimestamp.toLocaleString()} - [NOT SUBMITTED]`;
    }
    return (<Card key={`page:${p.id}`}>
      <CardHeader title={title} subheader={subtitle}></CardHeader>
      {content}
    </Card>);
  }).reverse();

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Typography component="h1" variant="h4" align="center">
        Medical Card
      </Typography>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        {address}
      </Paper>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={{ xs: 2, md: 3 }}>
          <TextField
            label="Doctor address"
            variant="filled"
            onChange={(event) => setDocAddress(event.target.value)}
            value={docAddress}
          />
          <TextField
            label="Doctor public key"
            variant="filled"
            onChange={(event) => setDocPubkey(event.target.value)}
            value={docPubkey}
          />
          <LoadingButton
            variant="contained"
            onClick={request}
            fullWidth
            loading={loading}
          >Create New Page</LoadingButton>
        </Stack>
      </Paper>
      {cards}
    </Stack>
  );
}

export default Generator;

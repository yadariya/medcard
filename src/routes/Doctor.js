import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import { MedicalCard } from '../web3';
import { useMyAddress } from './utils';

function Generator() {
  const { address } = useParams();
  const myAddress = useMyAddress();
  const contract = useMemo(() => new MedicalCard(address), [address]);

  const [pages, setPages] = useState(null);

  useEffect(() => {
    contract.pages().then(setPages);
  }, [contract]);

  const [docAddress, setDocAddress] = useState('');
  const [docPubkey, setDocPubkey] = useState('');
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);

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

  function handleInput(id, value) {
    setInputs({
      ...inputs,
      [id]: value
    });
  }

  async function response(id) {
    setLoading(true);
    try {
      await contract.response(pages[id], inputs[id]);
      try {
        await contract.pages().then(setPages);
        setLoading(false);
      } catch (e) {
        alert("Can't reload pages");
      }
    } catch (e) {
      alert("Can't submit response");
    }
  }

  const cards = pages.map(p => {
    if (!p.key) {
      return null;
    }

    let title, subtitle = `id ${p.id}, doc ${p.doctor}`, content, actions;
    if (p.responseTimestamp) {
      title = `${p.requestTimestamp.toLocaleString()} - ${p.responseTimestamp.toLocaleString()}`;
      content = <CardContent>
        {p.response}
      </CardContent>;
    } else {
      if (p.doctor.toLowerCase() != myAddress.toLowerCase()) {
        return null;
      }
      title = `${p.requestTimestamp.toLocaleString()} - [NOT SUBMITTED]`;
      content = <CardContent>
        <TextField
          label="Doctor's Response"
          variant="filled"
          value={inputs[p.id] || ''}
          onChange={(event) => handleInput(p.id, event.target.value)}
          fullWidth
        />
      </CardContent>;
      actions = <CardActions>
        <LoadingButton
          onClick={() => response(p.id)}
          loading={loading}
        >Submit</LoadingButton>
      </CardActions>;
    }
    return (<Card key={`page:${p.id}`}>
      <CardHeader title={title} subheader={subtitle}></CardHeader>
      {content}
      {actions}
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
      {cards}
    </Stack>
  );
}

export default Generator;

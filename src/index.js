import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// import './index.css';
import Connect from './routes/Connect';
import Generator from './routes/OpenCard';
import Owner from './routes/Owner';
import Doctor from './routes/Doctor';

// import 'bootstrap/dist/css/bootstrap.min.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const router = createMemoryRouter([
  {
    path: "/",
    element: <Connect />,
  },
  {
    path: "/generator",
    element: <Generator />,
  },
  {
    path: "/owner/:address",
    element: <Owner />,
  },
  {
    path: "/doctor/:address",
    element: <Doctor />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppBar
      position="absolute"
      color="default"
      elevation={0}
      sx={{
        position: 'relative',
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          Medical Card dApp
        </Typography>
      </Toolbar>
    </AppBar>
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <RouterProvider router={router} />
      </Paper>
    </Container>
  </ThemeProvider>
);

// root.render(
//   // <React.StrictMode>
//     <RouterProvider router={router} />
//   // </React.StrictMode>
// );

import { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { DomainInput } from './components/DomainInput';
import { SecurityDashboard } from './components/SecurityDashboard';
import type { SecurityReport } from './types/security';

// API configuration
const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8787';



const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

function App() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (domain: string) => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const url = `${API_HOST}/api/score?domain=${encodeURIComponent(domain)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to analyze domain');
      }

      const data = await response.json();
      setReport(data);
    } catch {
      setError('Failed to analyze domain. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 4
        }}
      >
        <Container maxWidth="lg">
          <DomainInput onSearch={handleSearch} loading={loading} />
          
          {report && (
            <SecurityDashboard 
              report={report} 
              loading={loading} 
              error={error || undefined}
            />
          )}
        </Container>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;

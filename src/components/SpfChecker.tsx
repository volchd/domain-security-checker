import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  Domain,
  Speed,
  Grade,
} from '@mui/icons-material';
import type { SpfReport } from '../types/spf';

// API configuration
const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8787';

interface SpfCheckerProps {
  onBack?: () => void;
}

export function SpfChecker({ onBack }: SpfCheckerProps) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SpfReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const url = `${API_HOST}/api/spf?domain=${encodeURIComponent(domain.trim())}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to analyze SPF records');
      }

      const data = await response.json();
      setReport(data);
    } catch {
      setError('Failed to analyze SPF records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getGradeColor = (grade: string): 'success' | 'warning' | 'info' | 'error' | 'default' => {
    switch (grade) {
      case 'A': return 'success';
      case 'B': return 'warning';
      case 'C': return 'info';
      case 'D': return 'error';
      case 'F': return 'error';
      default: return 'default';
    }
  };

  const getValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle color="success" fontSize="small" />
    ) : (
      <ErrorIcon color="error" fontSize="small" />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          SPF Record Checker
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Analyze SPF (Sender Policy Framework) records for any domain to check email authentication security.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            label="Enter domain name"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            sx={{ maxWidth: 400 }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!domain.trim() || loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze'}
          </Button>
          {onBack && (
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
      </Box>

      {report && (
        <Box>
          {/* Summary Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Domain: {report.domain}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Grade />
                    <Typography variant="h5" component="span">
                      Grade: 
                    </Typography>
                    <Chip
                      label={report.scoringResults.grade}
                      color={getGradeColor(report.scoringResults.grade)}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Score: {report.scoringResults.totalScore}/{report.scoringResults.maxPossibleScore} ({report.scoringResults.percentage}%)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Speed />
                    <Typography variant="body2">
                      {report.responseTime}ms
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Domain />
                    <Typography variant="body2">
                      {report.spfRecords.length} SPF records
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* SPF Records */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SPF Records Analysis
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Domain</TableCell>
                      <TableCell>SPF Record</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.spfRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {record.domain}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                            {record.spfRecord}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={record.type}
                            size="small"
                            color={record.type === 'initial' ? 'primary' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Validation Results */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Validation Results
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {Object.entries(report.validationResults).map(([key, value]) => {
                  if (key === 'firstAllQualifier') return null;
                  return (
                    <Box key={key} sx={{ minWidth: { xs: '100%', sm: '200px', md: '150px' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getValidationIcon(value.isValid)}
                        <Typography variant="body2">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      All Qualifier: {report.validationResults.firstAllQualifier.qualifier}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Scoring Details */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scoring Details
              </Typography>
              <List>
                {report.scoringResults.scoreItems.map((item, index) => (
                  <Box key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {item.passed ? (
                          <CheckCircle color="success" />
                        ) : (
                          <ErrorIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight={600}>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.score}/{item.maxScore} points
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.description}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              {item.details}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < report.scoringResults.scoreItems.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
} 
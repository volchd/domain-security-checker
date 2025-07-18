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
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  Domain,
  Speed,
  Grade,
  Security,
  Info,
  ExpandMore,
} from '@mui/icons-material';
import type { SpfReport } from '../types/spf';

// API configuration - update this to point to your separate backend Worker
const API_HOST = import.meta.env.VITE_API_HOST || 'https://your-backend-worker.your-subdomain.workers.dev';

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
                    <Security />
                    <Typography variant="body2">
                      {report.spfRecords.length} SPF records
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Score Breakdown
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {report.scoringResults.scoreItems.map((item, index) => (
                  <Box key={index} sx={{ 
                    p: 2, 
                    border: 1, 
                    borderColor: item.passed ? 'success.light' : 'error.light',
                    borderRadius: 1,
                    backgroundColor: item.passed ? 'success.50' : 'error.50'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        {getValidationIcon(item.passed)}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          {item.score}/{item.maxScore} points
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {item.details}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* SPF Records Analysis */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SPF Records Analysis
              </Typography>
              {report.spfRecords.map((record, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', flexWrap: 'wrap' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                        Domain: {record.domain}
                      </Typography>
                      <Chip
                        label={record.type}
                        size="small"
                        color={record.type === 'initial' ? 'primary' : 'default'}
                      />
                      <Chip
                        label={`${record.spfRecord.length} chars`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Raw SPF Record:
                        </Typography>
                        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            {record.spfRecord}
                          </Typography>
                        </Paper>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Record Details:
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon><Domain fontSize="small" /></ListItemIcon>
                              <ListItemText
                                primary="Domain"
                                secondary={record.domain}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><Info fontSize="small" /></ListItemIcon>
                              <ListItemText
                                primary="Type"
                                secondary={record.type}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><Security fontSize="small" /></ListItemIcon>
                              <ListItemText
                                primary="Record Length"
                                secondary={`${record.spfRecord.length} characters`}
                              />
                            </ListItem>
                          </List>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Validation Status:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Object.entries(report.validationResults).map(([key, value]) => {
                              if (key === 'firstAllQualifier') return null;
                              return (
                                <Chip
                                  key={key}
                                  label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  size="small"
                                  color={value.isValid ? 'success' : 'error'}
                                  variant="outlined"
                                />
                              );
                            })}
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              All Qualifier: {report.validationResults.firstAllQualifier.qualifier}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Metadata
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Domain />
                  <Typography variant="body2">
                    Request ID: {report.requestId}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Speed />
                  <Typography variant="body2">
                    Response Time: {report.responseTime}ms
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    Analyzed: {new Date(report.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
} 
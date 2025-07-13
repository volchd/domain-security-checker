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
import type { DmarcReport } from '../types/dmarc';

// API configuration
const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8787';

interface DmarcCheckerProps {
  onBack?: () => void;
}

export function DmarcChecker({ onBack }: DmarcCheckerProps) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DmarcReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const url = `${API_HOST}/api/dmarc?domain=${encodeURIComponent(domain.trim())}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to analyze DMARC records');
      }

      const data = await response.json();
      setReport(data);
    } catch {
      setError('Failed to analyze DMARC records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getGradeColor = (percentage: number): 'success' | 'warning' | 'info' | 'error' | 'default' => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    if (percentage >= 50) return 'info';
    return 'error';
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getValidationIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle color="success" fontSize="small" />
    ) : (
      <ErrorIcon color="error" fontSize="small" />
    );
  };

  const getPolicyColor = (policy: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (policy.toLowerCase()) {
      case 'reject': return 'success';
      case 'quarantine': return 'warning';
      case 'none': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          DMARC Record Checker
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Analyze DMARC (Domain-based Message Authentication, Reporting & Conformance) records for any domain to check email authentication security.
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
                    Domain: {report.record.domain}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Grade />
                    <Typography variant="h5" component="span">
                      Grade: 
                    </Typography>
                    <Chip
                      label={getGrade(report.score.percentage)}
                      color={getGradeColor(report.score.percentage)}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Score: {report.score.totalScore}/{report.score.maxPossibleScore} ({report.score.percentage}%)
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
                      Policy: {report.record.parsedData.policy}
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
                {report.score.scoreItems.map((item, index) => (
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

          {/* DMARC Record Analysis */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                DMARC Record Analysis
              </Typography>
              <Accordion sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', flexWrap: 'wrap' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                      Domain: {report.record.domain}
                    </Typography>
                    <Chip
                      label={`v${report.record.parsedData.version}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={report.record.parsedData.policy}
                      size="small"
                      color={getPolicyColor(report.record.parsedData.policy)}
                    />
                    {report.record.parsedData.percentage && (
                      <Chip
                        label={`${report.record.parsedData.percentage}% coverage`}
                        size="small"
                        color={report.record.parsedData.percentage === 100 ? 'success' : 'warning'}
                      />
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Raw DMARC Record:
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {report.record.rawRecord}
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Policy Configuration:
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><Info fontSize="small" /></ListItemIcon>
                            <ListItemText
                              primary="Version"
                              secondary={report.record.parsedData.version}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Security fontSize="small" /></ListItemIcon>
                            <ListItemText
                              primary="Policy (p=)"
                              secondary={report.record.parsedData.policy}
                            />
                          </ListItem>
                          {report.record.parsedData.subdomainPolicy && (
                            <ListItem>
                              <ListItemIcon><Domain fontSize="small" /></ListItemIcon>
                              <ListItemText
                                primary="Subdomain Policy (sp=)"
                                secondary={report.record.parsedData.subdomainPolicy}
                              />
                            </ListItem>
                          )}
                          {report.record.parsedData.percentage && (
                            <ListItem>
                              <ListItemIcon><Info fontSize="small" /></ListItemIcon>
                              <ListItemText
                                primary="Percentage (pct=)"
                                secondary={`${report.record.parsedData.percentage}%`}
                              />
                            </ListItem>
                          )}
                        </List>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Reporting Configuration:
                        </Typography>
                        {report.record.parsedData.reportEmails && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Aggregate Reports (rua):
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {report.record.parsedData.reportEmails.map((email, index) => (
                                <Chip
                                  key={index}
                                  label={email}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                        {report.record.parsedData.forensicEmails && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Forensic Reports (ruf):
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {report.record.parsedData.forensicEmails.map((email, index) => (
                                <Chip
                                  key={index}
                                  label={email}
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Retrieved at: {formatDate(report.record.retrievedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
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
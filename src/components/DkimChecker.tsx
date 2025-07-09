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
  Speed,
  Grade,
  ExpandMore,
  Key,
  Security,
  Info,
} from '@mui/icons-material';
import type { DkimReport } from '../types/dkim';

// API configuration
const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8787';

interface DkimCheckerProps {
  onBack?: () => void;
}

export function DkimChecker({ onBack }: DkimCheckerProps) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DkimReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const url = `${API_HOST}/api/dkim?domain=${encodeURIComponent(domain.trim())}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to analyze DKIM records');
      }

      const data = await response.json();
      setReport(data);
    } catch {
      setError('Failed to analyze DKIM records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getScoreColor = (percentage: number): 'success' | 'warning' | 'error' | 'default' => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const getValidationIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle color="success" fontSize="small" />
    ) : (
      <ErrorIcon color="error" fontSize="small" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getKeyLength = (publicKey: string): number => {
    // Simple estimation of key length based on base64 length
    const decodedLength = Math.ceil((publicKey.length * 3) / 4);
    if (decodedLength > 256) return 2048;
    if (decodedLength > 128) return 1024;
    return 512;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          DKIM Record Checker
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Analyze DKIM (DomainKeys Identified Mail) records for any domain to check email authentication security.
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
                      Score: 
                    </Typography>
                    <Chip
                      label={`${report.score.percentage}%`}
                      color={getScoreColor(report.score.percentage)}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {report.score.totalScore}/{report.score.maxPossibleScore} points
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
                    <Key />
                    <Typography variant="body2">
                      {report.records.length} DKIM records
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {report.score.scoreItems.map((item, index) => (
                  <Box key={index} sx={{ minWidth: { xs: '100%', md: 'calc(50% - 8px)' }, flex: 1 }}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getValidationIcon(item.passed)}
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {item.name}
                        </Typography>
                        <Chip
                          label={`${item.score}/${item.maxScore}`}
                          color={item.passed ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.description}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {item.details}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* DKIM Records */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                DKIM Records Analysis
              </Typography>
              {report.records.map((record, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', flexWrap: 'wrap' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                        Selector: {record.selector}
                      </Typography>
                      <Chip
                        label={record.parsedData.keyType || 'Unknown'}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${getKeyLength(record.parsedData.publicKey)} bits`}
                        size="small"
                        color={getKeyLength(record.parsedData.publicKey) >= 2048 ? 'success' : 'warning'}
                      />
                      {record.parsedData.version && (
                        <Chip
                          label={`v${record.parsedData.version}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {record.parsedData.flags && record.parsedData.flags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {record.parsedData.flags.map((flag, flagIndex) => (
                            <Chip
                              key={flagIndex}
                              label={flag}
                              size="small"
                              variant="outlined"
                              color="info"
                            />
                          ))}
                        </Box>
                      )}
                      {record.parsedData.notes && (
                        <Chip
                          label={record.parsedData.notes}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Raw DKIM Record:
                        </Typography>
                        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            {record.rawRecord}
                          </Typography>
                        </Paper>
                      </Box>
                      
                                             <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                         <Box sx={{ flex: 1 }}>
                           <Typography variant="subtitle2" gutterBottom>
                             Parsed Data:
                           </Typography>
                           <List dense>
                             <ListItem>
                               <ListItemIcon><Info fontSize="small" /></ListItemIcon>
                               <ListItemText
                                 primary="Version"
                                 secondary={record.parsedData.version || 'Not specified'}
                               />
                             </ListItem>
                             <ListItem>
                               <ListItemIcon><Security fontSize="small" /></ListItemIcon>
                               <ListItemText
                                 primary="Algorithm"
                                 secondary={record.parsedData.algorithm || 'Not specified'}
                               />
                             </ListItem>
                             <ListItem>
                               <ListItemIcon><Key fontSize="small" /></ListItemIcon>
                               <ListItemText
                                 primary="Key Type"
                                 secondary={record.parsedData.keyType || 'Not specified'}
                               />
                             </ListItem>
                             {record.parsedData.flags && record.parsedData.flags.length > 0 && (
                               <ListItem>
                                 <ListItemIcon><Info fontSize="small" /></ListItemIcon>
                                 <ListItemText
                                   primary="Flags"
                                   secondary={record.parsedData.flags.join(', ')}
                                 />
                               </ListItem>
                             )}
                             {record.parsedData.notes && (
                               <ListItem>
                                 <ListItemIcon><Info fontSize="small" /></ListItemIcon>
                                 <ListItemText
                                   primary="Notes"
                                   secondary={record.parsedData.notes}
                                 />
                               </ListItem>
                             )}
                           </List>
                         </Box>
                         <Box sx={{ flex: 1 }}>
                           <Typography variant="subtitle2" gutterBottom>
                             Public Key:
                           </Typography>
                           <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 200, overflow: 'auto' }}>
                             <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                               {record.parsedData.publicKey}
                             </Typography>
                           </Paper>
                         </Box>
                       </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Retrieved at: {formatDate(record.retrievedAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
} 
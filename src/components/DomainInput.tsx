import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search,
  Clear,
  Security,
  Domain
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface DomainInputProps {
  onSearch: (domain: string) => void;
  loading?: boolean;
}

const MotionPaper = motion.create(Paper);

export const DomainInput: React.FC<DomainInputProps> = ({ onSearch, loading = false }) => {
  const [domain, setDomain] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = ['google.com', 'microsoft.com', 'github.com'];
  const filteredSuggestions = domain
    ? suggestions.filter((s) => s.startsWith(domain.toLowerCase()) && s !== domain.toLowerCase())
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onSearch(domain.trim());
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setDomain('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDomain(suggestion);
    setShowSuggestions(false);
  };

  const isValidDomain = (input: string) => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(input);
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        p: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        mb: 4
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            mb: 2
          }}
        >
          <Security sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Domain Security Checker
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Analyze SPF, DKIM, and DMARC security for any domain
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} autoComplete="off">
        <Box sx={{ position: 'relative', display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => domain && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
            placeholder="Enter domain (e.g., example.com)"
            variant="outlined"
            size="medium"
            disabled={loading}
            error={domain.length > 0 && !isValidDomain(domain)}
            helperText={domain.length > 0 && !isValidDomain(domain) ? 'Please enter a valid domain' : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Domain sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
              endAdornment: domain && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClear}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
              }
            }}
          />
          {/* Dropdown Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 56,
                width: '100%',
                zIndex: 10,
                background: 'rgba(255,255,255,0.98)',
                color: '#333',
                borderRadius: 2,
                boxShadow: '0 4px 16px 0 rgba(80,80,120,0.15)',
                border: '1px solid #e0e0e0',
                mt: 1,
                py: 1,
                px: 0.5
              }}
            >
              {filteredSuggestions.map((s) => (
                <Box
                  key={s}
                  onMouseDown={() => handleSuggestionClick(s)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1.2,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '1rem',
                    transition: 'background 0.15s',
                    '&:hover': {
                      background: 'rgba(102,126,234,0.10)',
                    },
                  }}
                >
                  <Domain sx={{ fontSize: 18, color: '#764ba2', mr: 1 }} />
                  {s}
                </Box>
              ))}
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!domain.trim() || loading || !isValidDomain(domain)}
            startIcon={loading ? null : <Search />}
            sx={{
              minWidth: 120,
              height: 56,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: '600',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
              }
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </Box>
      </form>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Try: google.com, microsoft.com, github.com
        </Typography>
      </Box>
    </MotionPaper>
  );
}; 
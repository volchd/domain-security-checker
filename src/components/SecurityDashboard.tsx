import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Security,
  Email,
  VerifiedUser,
  Shield
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { SecurityCard } from './SecurityCard';
import type { SecurityReport } from '../types/security';

interface SecurityDashboardProps {
  report: SecurityReport;
  loading?: boolean;
  error?: string;
}

const MotionPaper = motion(Paper);

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  report,
  loading = false,
  error
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: 3
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Analyzing domain security...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }

  const getOverallGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', color: '#4caf50', icon: <Shield /> };
    if (percentage >= 80) return { grade: 'B', color: '#8bc34a', icon: <VerifiedUser /> };
    if (percentage >= 70) return { grade: 'C', color: '#ff9800', icon: <Email /> };
    if (percentage >= 60) return { grade: 'D', color: '#ff5722', icon: <Security /> };
    return { grade: 'F', color: '#f44336', icon: <Security /> };
  };

  const overallGrade = getOverallGrade(report.percentage);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <MotionPaper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${overallGrade.color}15, ${overallGrade.color}05)`,
          border: `1px solid ${overallGrade.color}30`,
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${overallGrade.color}, ${overallGrade.color}80)`,
              color: 'white',
              mr: 3
            }}
          >
            {overallGrade.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
              {report.domain}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Security Analysis Report
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" fontWeight="700" color={overallGrade.color}>
              {report.totalScore}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              / {report.maxPossibleScore} points
            </Typography>
            <Chip
              label={`Grade ${overallGrade.grade} (${report.percentage}%)`}
              size="medium"
              sx={{
                backgroundColor: overallGrade.color,
                color: 'white',
                fontWeight: '600',
                fontSize: '1rem',
                height: 32
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Chip
            icon={<Security sx={{ fontSize: 32 }} />}
            label={`SPF: ${report.scores.spf.percentage}%`}
            variant="outlined"
            sx={{
              borderColor: '#2196f3',
              color: '#2196f3',
              height: 60,
              fontSize: '1.5rem',
              '.MuiChip-icon': { fontSize: 32 }
            }}
          />
          <Chip
            icon={<Email sx={{ fontSize: 32 }} />}
            label={`DKIM: ${report.scores.dkim.percentage}%`}
            variant="outlined"
            sx={{
              borderColor: '#4caf50',
              color: '#4caf50',
              height: 60,
              fontSize: '1.5rem',
              '.MuiChip-icon': { fontSize: 32 }
            }}
          />
          <Chip
            icon={<VerifiedUser sx={{ fontSize: 32 }} />}
            label={`DMARC: ${report.scores.dmarc.percentage}%`}
            variant="outlined"
            sx={{
              borderColor: '#ff9800',
              color: '#ff9800',
              height: 60,
              fontSize: '1.5rem',
              '.MuiChip-icon': { fontSize: 32 }
            }}
          />
        </Box>
      </MotionPaper>

      {/* Security Cards Stack */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <SecurityCard
          title="SPF Protection"
          score={report.scores.spf}
          color="#2196f3"
          icon={<Security />}
          delay={0.2}
        />
        <SecurityCard
          title="DKIM Authentication"
          score={report.scores.dkim}
          color="#4caf50"
          icon={<Email />}
          delay={0.4}
        />
        <SecurityCard
          title="DMARC Policy"
          score={report.scores.dmarc}
          color="#ff9800"
          icon={<VerifiedUser />}
          delay={0.6}
        />
      </Box>

      {/* Footer Info */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        sx={{
          p: 2,
          mt: 4,
          backgroundColor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Request ID: {report.requestId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Response Time: {report.responseTime}ms
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analyzed: {new Date(report.timestamp).toLocaleString()}
          </Typography>
        </Box>
      </MotionPaper>
    </Box>
  );
}; 
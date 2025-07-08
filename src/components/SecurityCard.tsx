import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  LinearProgress,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess,
  CheckCircle,
  Error,
  Warning
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { SecurityScore } from '../types/security';

interface SecurityCardProps {
  title: string;
  score: SecurityScore;
  color: string;
  icon: React.ReactNode;
  delay?: number;
}

const MotionCard = motion(Card);

export const SecurityCard: React.FC<SecurityCardProps> = ({ 
  title, 
  score, 
  color, 
  icon,
  delay = 0 
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 70) return '#ff9800';
    return '#f44336';
  };

  const getGradeIcon = (percentage: number) => {
    if (percentage >= 90) return <CheckCircle sx={{ color: '#4caf50' }} />;
    if (percentage >= 70) return <Warning sx={{ color: '#ff9800' }} />;
    return <Error sx={{ color: '#f44336' }} />;
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      sx={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${color}20`,
          transition: 'all 0.3s ease'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${color}, ${color}80)`,
              color: 'white',
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="600" color="text.primary">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {score.scoreItems.filter(item => item.passed).length} of {score.scoreItems.length} checks passed
            </Typography>
          </Box>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ color: color }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ mr: 1 }}>
                {score.totalScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                / {score.maxPossibleScore}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={score.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: `${color}20`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                  borderRadius: 4
                }
              }}
            />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            {getGradeIcon(score.percentage)}
            <Typography variant="h6" fontWeight="600" color={getGradeColor(score.percentage)}>
              {score.percentage}%
            </Typography>
            {score.grade && (
              <Chip
                label={score.grade}
                size="small"
                sx={{
                  backgroundColor: getGradeColor(score.percentage),
                  color: 'white',
                  fontWeight: '600'
                }}
              />
            )}
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            {score.scoreItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: item.passed ? `${color}10` : '#ffebee',
                    border: `1px solid ${item.passed ? `${color}30` : '#ffcdd2'}`
                  }}
                >
                  <Box sx={{ mr: 2 }}>
                    {item.passed ? (
                      <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                    ) : (
                      <Error sx={{ color: '#f44336', fontSize: 20 }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="500" color="text.primary">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.details}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${item.score}/${item.maxScore}`}
                    size="small"
                    sx={{
                      backgroundColor: item.passed ? '#4caf50' : '#f44336',
                      color: 'white',
                      fontWeight: '600'
                    }}
                  />
                </Box>
              </motion.div>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </MotionCard>
  );
}; 
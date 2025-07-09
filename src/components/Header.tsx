import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { Security } from '@mui/icons-material';

export const Header = () => {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        color: '#1a202c'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Security 
              sx={{ 
                color: '#667eea',
                fontSize: 32
              }} 
            />
            <Box>
              <Typography 
                variant="h6" 
                component="h1"
                sx={{ 
                  fontWeight: 700,
                  color: '#1a202c',
                  lineHeight: 1.2
                }}
              >
                Domain Security Checker
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#64748b',
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Analyze domain security and compliance
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}; 
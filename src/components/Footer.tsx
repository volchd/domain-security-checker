import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { GitHub, Security, Code } from '@mui/icons-material';

interface FooterProps {
  onNavigate?: (page: 'main' | 'spf' | 'dkim') => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 4,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Main footer content */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Security sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c' }}>
                Domain Security Checker
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
              A comprehensive tool for analyzing domain security, SSL certificates, 
              and compliance standards to help protect your online presence.
            </Typography>
          </Box>

          {/* Links section */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a202c', mb: 1 }}>
                Free Tools
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Link 
                  component="button"
                  onClick={() => onNavigate?.('spf')}
                  sx={{ 
                    color: '#64748b', 
                    textDecoration: 'none',
                    '&:hover': { color: '#667eea' },
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    fontSize: 'inherit'
                  }}
                >
                  SPF Checker
                </Link>
                <Link 
                  component="button"
                  onClick={() => onNavigate?.('dkim')}
                  sx={{ 
                    color: '#64748b', 
                    textDecoration: 'none',
                    '&:hover': { color: '#667eea' },
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    fontSize: 'inherit'
                  }}
                >
                  DKIM Checker
                </Link>
                <Link 
                  href="#" 
                  sx={{ 
                    color: '#64748b', 
                    textDecoration: 'none',
                    '&:hover': { color: '#667eea' }
                  }}
                >
                  DMARC Checker
                </Link>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a202c', mb: 1 }}>
                Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Link 
                  href="#" 
                  sx={{ 
                    color: '#64748b', 
                    textDecoration: 'none',
                    '&:hover': { color: '#667eea' }
                  }}
                >
                  Help Center
                </Link>
                <Link 
                  href="#" 
                  sx={{ 
                    color: '#64748b', 
                    textDecoration: 'none',
                    '&:hover': { color: '#667eea' }
                  }}
                >
                  Contact Us
                </Link>
                <Link 
                  href="#" 
                  sx={{ 
                    color: '#64748b', 
                    textDecoration: 'none',
                    '&:hover': { color: '#667eea' }
                  }}
                >
                  Privacy Policy
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(0, 0, 0, 0.06)' }} />

        {/* Bottom section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            © {currentYear} Domain Security Checker. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link 
              href="#" 
              sx={{ 
                color: '#64748b', 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                '&:hover': { color: '#667eea' }
              }}
            >
              <GitHub sx={{ fontSize: 20 }} />
              <Typography variant="body2">GitHub</Typography>
            </Link>
            <Link 
              href="#" 
              sx={{ 
                color: '#64748b', 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                '&:hover': { color: '#667eea' }
              }}
            >
              <Code sx={{ fontSize: 20 }} />
              <Typography variant="body2">API</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}; 
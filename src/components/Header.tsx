import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Security,
  ExpandMore,
  Email,
  VerifiedUser,
  Shield
} from '@mui/icons-material';
import { useState } from 'react';

interface HeaderProps {
  onNavigate?: (page: 'main' | 'spf') => void;
}

export const Header = ({ onNavigate }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToolSelect = (tool: string) => {
    if (onNavigate) {
      if (tool === 'spf') {
        onNavigate('spf');
      } else if (tool === 'main') {
        onNavigate('main');
      }
    }
    handleClose();
  };

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
        <Toolbar sx={{ px: { xs: 0 }, justifyContent: 'space-between' }}>
          <Box 
            sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
            onClick={() => onNavigate?.('main')}
          >
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

          {/* Free Tools Dropdown */}
          <Box>
            <Button
              id="free-tools-button"
              aria-controls={open ? 'free-tools-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              endIcon={<ExpandMore />}
              sx={{
                color: '#1a202c',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.08)'
                }
              }}
            >
              Free Tools
            </Button>
            <Menu
              id="free-tools-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'free-tools-button',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  border: '1px solid rgba(0, 0, 0, 0.06)'
                }
              }}
            >
              <MenuItem onClick={() => handleToolSelect('spf')}>
                <ListItemIcon>
                  <Shield sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="SPF Checker"
                  secondary="Check SPF record configuration"
                />
              </MenuItem>
              <MenuItem onClick={() => handleToolSelect('dkim')}>
                <ListItemIcon>
                  <Email sx={{ color: '#4caf50' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="DKIM Checker"
                  secondary="Verify DKIM authentication"
                />
              </MenuItem>
              <MenuItem onClick={() => handleToolSelect('dmarc')}>
                <ListItemIcon>
                  <VerifiedUser sx={{ color: '#ff9800' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="DMARC Checker"
                  secondary="Analyze DMARC policy"
                />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}; 
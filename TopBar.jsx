import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Description,
  Settings,
  AccountCircle
} from '@mui/icons-material';

const TopBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 1)' 
          : 'rgba(18, 18, 18, 1)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {/* Logo and Main Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            onClick={handleMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            PDF2Audio
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button
            color="primary"
            startIcon={<Dashboard />}
            onClick={() => handleNavigation('/dashboard')}
            sx={{ 
              color: isActive('/dashboard') ? theme.palette.primary.main : theme.palette.text.primary,
              fontWeight: isActive('/dashboard') ? 'bold' : 'normal',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }
            }}
          >
            Dashboard
          </Button>
          <Button
            color="primary"
            startIcon={<Description />}
            onClick={() => handleNavigation('/documents')}
            sx={{ 
              color: isActive('/documents') ? theme.palette.primary.main : theme.palette.text.primary,
              fontWeight: isActive('/documents') ? 'bold' : 'normal',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }
            }}
          >
            Documents
          </Button>
          <Button
            color="primary"
            startIcon={<Settings />}
            onClick={() => handleNavigation('/settings')}
            sx={{ 
              color: isActive('/settings') ? theme.palette.primary.main : theme.palette.text.primary,
              fontWeight: isActive('/settings') ? 'bold' : 'normal',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }
            }}
          >
            Settings
          </Button>
          <Button
            color="primary"
            startIcon={<AccountCircle />}
            onClick={() => handleNavigation('/profile')}
            sx={{ 
              color: isActive('/profile') ? theme.palette.primary.main : theme.palette.text.primary,
              fontWeight: isActive('/profile') ? 'bold' : 'normal',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }
            }}
          >
            Profile
          </Button>
        </Box>

        {/* Mobile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }
          }}
        >
          <MenuItem 
            onClick={() => handleNavigation('/dashboard')}
            sx={{
              color: isActive('/dashboard') ? theme.palette.primary.main : 'inherit',
              fontWeight: isActive('/dashboard') ? 'bold' : 'normal',
            }}
          >
            <ListItemIcon>
              <Dashboard fontSize="small" color={isActive('/dashboard') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleNavigation('/documents')}
            sx={{
              color: isActive('/documents') ? theme.palette.primary.main : 'inherit',
              fontWeight: isActive('/documents') ? 'bold' : 'normal',
            }}
          >
            <ListItemIcon>
              <Description fontSize="small" color={isActive('/documents') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText>Documents</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleNavigation('/settings')}
            sx={{
              color: isActive('/settings') ? theme.palette.primary.main : 'inherit',
              fontWeight: isActive('/settings') ? 'bold' : 'normal',
            }}
          >
            <ListItemIcon>
              <Settings fontSize="small" color={isActive('/settings') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleNavigation('/profile')}
            sx={{
              color: isActive('/profile') ? theme.palette.primary.main : 'inherit',
              fontWeight: isActive('/profile') ? 'bold' : 'normal',
            }}
          >
            <ListItemIcon>
              <AccountCircle fontSize="small" color={isActive('/profile') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar; 
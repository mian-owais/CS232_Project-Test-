import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  TextField,
  Button,
  Stack,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Book,
  Add as AddIcon,
  Delete as DeleteIcon,
  Favorite,
  Language,
  Notifications,
  Palette,
  Timer,
  TrendingUp,
  History,
  Star,
  Bookmark,
  AutoStories,
  Speed,
  DarkMode,
  LightMode,
  Psychology,
  AutoFixHigh,
  EmojiEvents
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const MotionPaper = motion(Paper);

const Settings = () => {
  const theme = useTheme();
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    darkMode: false,
    readingSpeed: 250,
    preferredLanguage: 'en',
    notificationPreferences: 'all',
    theme: 'light',
    favoriteBooks: [],
    readingGoals: {
      booksThisMonth: 3,
      targetBooks: 5,
      readingStreak: 7
    },
    readingHistory: []
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/settings', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setSnackbar({
          open: true,
          message: 'Error loading settings',
          severity: 'error'
        });
      }
    };

    if (token) {
      fetchSettings();
    }
  }, [token]);

  const handleSettingChange = async (key, value) => {
    try {
      await axios.put(
        'http://localhost:5000/api/users/settings',
        { [key]: value },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSettings(prev => ({ ...prev, [key]: value }));
      setSnackbar({
        open: true,
        message: 'Settings updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      setSnackbar({
        open: true,
        message: 'Error updating settings',
        severity: 'error'
      });
    }
  };

  const handleAddBook = async (book) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/favorite-books',
        book,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSettings(prev => ({
        ...prev,
        favoriteBooks: [...prev.favoriteBooks, response.data]
      }));
      setSnackbar({
        open: true,
        message: 'Book added successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding book:', error);
      setSnackbar({
        open: true,
        message: 'Error adding book',
        severity: 'error'
      });
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/favorite-books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSettings(prev => ({
        ...prev,
        favoriteBooks: prev.favoriteBooks.filter(book => book.id !== bookId)
      }));
      setSnackbar({
        open: true,
        message: 'Book removed successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error removing book:', error);
      setSnackbar({
        open: true,
        message: 'Error removing book',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ 
      p: 3, 
      maxWidth: 1200, 
      mx: 'auto',
      background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4
        }}
      >
        Settings
      </Typography>

      {/* Reading Profile Section */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
              boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            <Psychology fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Reading Profile</Typography>
            <Typography variant="body2" color="text.secondary">
              Customize your reading experience
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Speed color="primary" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" gutterBottom>
                Reading Speed: {settings.readingSpeed} words per minute
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={settings.readingSpeed / 5} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  background: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: 4
                  }
                }}
              />
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <DarkMode color="primary" />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-track': {
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }
                  }}
                />
              }
              label="Dark Mode"
            />
          </Stack>
        </Stack>
      </MotionPaper>

      {/* Favorite Books Section */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Book color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Favorite Books</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            sx={{ 
              ml: 'auto',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              }
            }}
          >
            Add Book
          </Button>
        </Stack>
        <List>
          {settings.favoriteBooks.map((book) => (
            <ListItem
              key={book.id}
              sx={{
                borderRadius: 2,
                mb: 1,
                transition: 'all 0.3s',
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.05),
                  transform: 'translateX(5px)'
                }
              }}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBook(book.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <Favorite color="error" />
              </ListItemIcon>
              <ListItemText
                primary={book.title}
                secondary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">{book.author}</Typography>
                    <Chip 
                      size="small" 
                      label={book.genre} 
                      color="primary"
                      sx={{ 
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        color: 'white'
                      }}
                    />
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      </MotionPaper>

      {/* Reading Goals Section */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <TrendingUp color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Reading Goals</Typography>
        </Stack>
        <Stack spacing={3}>
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Books this month</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {settings.readingGoals.booksThisMonth}/{settings.readingGoals.targetBooks}
              </Typography>
            </Stack>
            <LinearProgress 
              variant="determinate" 
              value={(settings.readingGoals.booksThisMonth / settings.readingGoals.targetBooks) * 100} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                background: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 4
                }
              }} 
            />
          </Box>
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Reading streak</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {settings.readingGoals.readingStreak} days
              </Typography>
            </Stack>
            <LinearProgress 
              variant="determinate" 
              value={(settings.readingGoals.readingStreak / 30) * 100} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                background: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 4
                }
              }} 
            />
          </Box>
        </Stack>
      </MotionPaper>

      {/* Reading History Section */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <History color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Reading History</Typography>
        </Stack>
        <List>
          {settings.readingHistory.map((history) => (
            <ListItem
              key={history.id}
              sx={{
                borderRadius: 2,
                mb: 1,
                transition: 'all 0.3s',
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.05),
                  transform: 'translateX(5px)'
                }
              }}
            >
              <ListItemIcon>
                <AutoStories color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={history.title}
                secondary={`Last read: ${history.lastRead}`}
              />
              <Tooltip title="Rating">
                <Stack direction="row" spacing={0.5}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      sx={{ 
                        color: star <= history.rating ? 'gold' : 'grey.300',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.2)'
                        }
                      }} 
                    />
                  ))}
                </Stack>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </MotionPaper>

      {/* Preferences Section */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        sx={{ 
          p: 3,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Preferences
        </Typography>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Language color="primary" />
            <FormControl fullWidth>
              <InputLabel>Preferred Language</InputLabel>
              <Select
                value={settings.preferredLanguage}
                label="Preferred Language"
                onChange={(e) => handleSettingChange('preferredLanguage', e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="it">Italian</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Notifications color="primary" />
            <FormControl fullWidth>
              <InputLabel>Notification Preferences</InputLabel>
              <Select
                value={settings.notificationPreferences}
                label="Notification Preferences"
                onChange={(e) => handleSettingChange('notificationPreferences', e.target.value)}
              >
                <MenuItem value="all">All Notifications</MenuItem>
                <MenuItem value="important">Important Only</MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Palette color="primary" />
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                value={settings.theme}
                label="Theme"
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System Default</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </MotionPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 
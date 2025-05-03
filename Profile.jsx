import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Description as DescriptionIcon,
  CreditCard as CreditCardIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const defaultSettings = {
  darkMode: false,
  readingSpeed: 250,
  preferredLanguage: 'en',
  notificationPreferences: 'all',
  theme: 'light',
  favoriteBooks: [],
  readingGoals: {
    booksThisMonth: 0,
    targetBooks: 5,
    readingStreak: 0
  },
  readingHistory: []
};

const Profile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSettings({
          ...defaultSettings,
          ...response.data
        });
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSettings();
    }
  }, [token]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/settings', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleReadingGoalUpdate = async (goalType, value) => {
    try {
      await axios.put('/api/settings/goals', {
        targetBooks: value
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(prevSettings => ({
        ...prevSettings,
        readingGoals: {
          ...prevSettings.readingGoals,
          targetBooks: value
        }
      }));
    } catch (err) {
      setError('Failed to update reading goals');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar
                  sx={{ width: 100, height: 100, mb: 2 }}
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                />
                <Typography variant="h5" component="h1" gutterBottom>
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                <Chip
                  label="Free Plan"
                  color="primary"
                  sx={{ mt: 2 }}
                />
              </Box>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </Paper>
          </motion.div>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<PersonIcon />} label="Personal Details" />
              <Tab icon={<DescriptionIcon />} label="My Files" />
              <Tab icon={<CreditCardIcon />} label="Subscription" />
              <Tab icon={<SettingsIcon />} label="Settings" />
            </Tabs>

            <Box p={3}>
              {activeTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isEditing ? (
                    <Box component="form" noValidate autoComplete="off">
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                          >
                            Save Changes
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Name"
                          secondary={user?.name}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email"
                          secondary={user?.email}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Username"
                          secondary={user?.username}
                        />
                      </ListItem>
                    </List>
                  )}
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h6" gutterBottom>
                    My Files
                  </Typography>
                  {settings.readingHistory.length === 0 ? (
                    <Typography color="text.secondary" align="center">
                      No reading history available
                    </Typography>
                  ) : (
                    <List>
                      {settings.readingHistory.map((item, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemIcon>
                              <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={item.title}
                              secondary={`Last read: ${new Date(item.lastRead).toLocaleDateString()} - Rating: ${item.rating}/5`}
                            />
                          </ListItem>
                          {index < settings.readingHistory.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </motion.div>
              )}

              {activeTab === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Subscription Plan
                  </Typography>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        Free Plan
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                        Current Plan
                      </Typography>
                      <Typography variant="body2">
                        Upgrade to Premium for unlimited access
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/subscription')}
                      >
                        Upgrade Plan
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              )}

              {activeTab === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Reading Settings
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Reading Speed</InputLabel>
                        <Select
                          value={settings.readingSpeed}
                          onChange={(e) => handleReadingGoalUpdate('targetBooks', Number(e.target.value))}
                        >
                          <MenuItem value={150}>Slow (150 wpm)</MenuItem>
                          <MenuItem value={250}>Medium (250 wpm)</MenuItem>
                          <MenuItem value={350}>Fast (350 wpm)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Target Books per Month"
                        value={settings.readingGoals.targetBooks}
                        onChange={(e) => handleReadingGoalUpdate('targetBooks', parseInt(e.target.value))}
                      />
                    </Grid>
                  </Grid>
                </motion.div>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 
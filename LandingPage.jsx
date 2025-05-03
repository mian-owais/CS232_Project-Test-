import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Stack, 
  Paper,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import {
  AutoStories,
  Speed,
  Security,
  AutoFixHigh,
  CloudUpload,
  BarChart,
  Psychology,
  ExpandMore,
  CheckCircle,
  Star,
  PlayCircle,
  People,
  School,
  Business,
  Menu,
  Close,
  ArrowForward,
  Mic,
  Headphones,
  Translate,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const FeatureCard = ({ icon, title, description }) => (
  <MotionPaper
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: 4,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    }}
  >
    <Box sx={{ mb: 2 }}>{icon}</Box>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </MotionPaper>
);

const PricingCard = ({ title, price, features, popular = false }) => (
  <Card sx={{ 
    maxWidth: 345, 
    position: 'relative',
    transform: popular ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: popular ? 'scale(1.08)' : 'scale(1.03)',
    }
  }}>
    {popular && (
      <Chip
        label="Most Popular"
        color="primary"
        sx={{ position: 'absolute', top: 16, right: 16 }}
      />
    )}
    <CardContent>
      <Typography variant="h5" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" gutterBottom>
        {price}
      </Typography>
      <List>
        {features.map((feature, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText primary={feature} />
          </ListItem>
        ))}
      </List>
      <Button
        variant={popular ? "contained" : "outlined"}
        fullWidth
        sx={{ mt: 2 }}
      >
        Get Started
      </Button>
    </CardContent>
  </Card>
);

const LandingPage = ({ toggleTheme, mode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: <Mic sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "High-Quality Voice",
      description: "Natural-sounding voices with multiple language support"
    },
    {
      icon: <Headphones sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Background Music",
      description: "Add ambient sounds to enhance your listening experience"
    },
    {
      icon: <Translate sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Multi-Language",
      description: "Support for multiple languages and accents"
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Fast Processing",
      description: "Quick conversion of your documents to audio"
    }
  ];

  const pricingPlans = [
    {
      title: "Basic",
      price: "$9.99/mo",
      features: [
        "Up to 10 documents per month",
        "Standard voice quality",
        "Basic background sounds",
        "Email support"
      ]
    },
    {
      title: "Pro",
      price: "$19.99/mo",
      features: [
        "Unlimited documents",
        "Premium voice quality",
        "Advanced background sounds",
        "Priority support",
        "Team collaboration"
      ],
      popular: true
    },
    {
      title: "Enterprise",
      price: "Custom",
      features: [
        "Custom document limits",
        "Custom voice models",
        "API access",
        "Dedicated support",
        "Advanced analytics"
      ]
    }
  ];

  const faqs = [
    {
      question: "How does the PDF to speech conversion work?",
      answer: "Our platform uses advanced AI technology to extract text from your PDFs and convert it into natural-sounding speech with customizable voices and background effects."
    },
    {
      question: "What file formats are supported?",
      answer: "We support PDF, DOCX, and TXT files. More formats will be added soon."
    },
    {
      question: "Can I customize the voice and speed?",
      answer: "Yes, you can choose from multiple voices, adjust the speaking rate, and add background music to enhance your listening experience."
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar position="fixed" sx={{ 
        background: mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.9)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              TTS Platform
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
              <Button color="inherit">Features</Button>
              <Button color="inherit">Pricing</Button>
              <Button color="inherit">About</Button>
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <Button variant="contained" onClick={handleGetStarted}>
                Get Started
              </Button>
            </Box>
            <IconButton
              color="inherit"
              sx={{ display: { md: 'none' } }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Close /> : <Menu />}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <Box sx={{ 
          position: 'fixed', 
          top: 64, 
          left: 0, 
          right: 0, 
          background: theme.palette.background.paper,
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <Stack spacing={2} sx={{ p: 2 }}>
            <Button fullWidth>Features</Button>
            <Button fullWidth>Pricing</Button>
            <Button fullWidth>About</Button>
            <Button 
              fullWidth 
              startIcon={mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              onClick={toggleTheme}
            >
              {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button fullWidth variant="contained" onClick={handleGetStarted}>
              Get Started
            </Button>
          </Stack>
        </Box>
      )}

      <Box sx={{ pt: 8 }}>
        {/* Hero Section */}
        <Box sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          py: 8
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <MotionBox
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Transform Your PDFs into Audio
                  </Typography>
                  <Typography variant="h5" color="text.secondary" paragraph>
                    Listen to your documents on the go with our advanced text-to-speech technology
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button 
                      variant="contained" 
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={handleGetStarted}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large"
                      startIcon={<PlayCircle />}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                </MotionBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MotionBox
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Box
                    component="img"
                    src="/hero-image.png"
                    alt="Hero"
                    sx={{ 
                      width: '100%', 
                      height: 'auto',
                      borderRadius: 4,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </MotionBox>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Powerful Features
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Everything you need to transform your documents into audio
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Pricing Section */}
        <Box sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          py: 8
        }}>
          <Container maxWidth="lg">
            <Typography variant="h3" align="center" gutterBottom>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Choose the plan that's right for you
            </Typography>
            <Grid container spacing={4} sx={{ mt: 4 }}>
              {pricingPlans.map((plan, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <PricingCard {...plan} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* FAQ Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 4 }}>
            {faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>

        {/* Call to Action */}
        <Box sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          py: 8,
          color: 'white'
        }}>
          <Container maxWidth="lg">
            <Typography variant="h3" align="center" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" align="center" paragraph>
              Join thousands of users who are already transforming their documents
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  background: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
                onClick={handleGetStarted}
              >
                Start Free Trial
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage; 
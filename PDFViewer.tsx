import { Box, Grid, Paper, Typography, TextField, Button, IconButton, Tooltip, Divider, Chip, Stack, Slider } from '@mui/material';
import { useState } from 'react';
import { 
  Save, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateRight, 
  RotateLeft,
  Bookmark,
  Share,
  Print,
  Highlight,
  Comment,
  Search
} from '@mui/icons-material';

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [notes, setNotes] = useState<string>('');
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90) % 360);
  };

  return (
    <Box sx={{ height: '100vh', p: 3, bgcolor: '#f5f5f5' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* PDF Viewer */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: '100%', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'white'
            }}
          >
            {/* PDF Controls */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 2,
              flexWrap: 'wrap'
            }}>
              <Tooltip title="Zoom In">
                <IconButton onClick={handleZoomIn}>
                  <ZoomIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton onClick={handleZoomOut}>
                  <ZoomOut />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ mx: 1 }}>
                {zoom}%
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Tooltip title="Rotate Right">
                <IconButton onClick={handleRotateRight}>
                  <RotateRight />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rotate Left">
                <IconButton onClick={handleRotateLeft}>
                  <RotateLeft />
                </IconButton>
              </Tooltip>
              <Divider orientation="vertical" flexItem />
              <Tooltip title="Search">
                <IconButton>
                  <Search />
                </IconButton>
              </Tooltip>
              <Tooltip title="Highlight">
                <IconButton>
                  <Highlight />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Comment">
                <IconButton>
                  <Comment />
                </IconButton>
              </Tooltip>
              <Box sx={{ flexGrow: 1 }} />
              <Tooltip title="Print">
                <IconButton>
                  <Print />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton>
                  <Share />
                </IconButton>
              </Tooltip>
            </Box>

            {/* PDF Content */}
            <Box sx={{ 
              flexGrow: 1, 
              overflow: 'hidden',
              position: 'relative',
              bgcolor: '#e0e0e0',
              borderRadius: 1
            }}>
              <iframe
                src={pdfUrl}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none',
                  transform: `scale(${zoom/100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center'
                }}
                title="PDF Viewer"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Notes and Tools Section */}
        <Grid item xs={12} md={5}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            {/* Search and Highlights */}
            <Paper elevation={3} sx={{ p: 2, bgcolor: 'white' }}>
              <Typography variant="h6" gutterBottom>
                Search & Highlights
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search in document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {highlights.map((highlight, index) => (
                  <Chip 
                    key={index} 
                    label={highlight} 
                    onDelete={() => {
                      setHighlights(prev => prev.filter((_, i) => i !== index));
                    }}
                  />
                ))}
              </Box>
            </Paper>

            {/* Notes Section */}
            <Paper 
              elevation={3} 
              sx={{ 
                flexGrow: 1, 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'white'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Notes
                </Typography>
                <Box>
                  <Tooltip title="Save Notes">
                    <IconButton>
                      <Save />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export Notes">
                    <IconButton>
                      <Download />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes here..."
                sx={{ 
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    height: '100%',
                    alignItems: 'flex-start'
                  }
                }}
                InputProps={{
                  sx: {
                    height: '100%',
                    '& textarea': {
                      height: '100% !important'
                    }
                  }
                }}
              />
            </Paper>

            {/* Bookmarks Section */}
            <Paper elevation={3} sx={{ p: 2, bgcolor: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Bookmark sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Bookmarks
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Chip label="Page 1: Introduction" />
                <Chip label="Page 5: Key Concepts" />
                <Chip label="Page 10: Summary" />
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PDFViewer; 
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import { 
  CloudUpload, 
  Description, 
  Delete, 
  PlayArrow,
  Pause,
  MusicNote,
  VolumeUp
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
      setUploading(true);
      const response = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDocuments(prev => [...prev, response.data]);
      setSuccess('Document uploaded successfully');
    } catch (err) {
      setError('Error uploading document');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleProcess = async (id) => {
    try {
      setProcessingProgress(0);
      const response = await axios.post(`/api/documents/process/${id}`);
      setSuccess('Document processing started');
      
      // Update the document with processing status
      setDocuments(prev => prev.map(doc => 
        doc._id === id ? { ...doc, status: 'processing' } : doc
      ));

      // Poll for status updates
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(`/api/documents/${id}`);
          const updatedDoc = statusResponse.data;
          
          if (updatedDoc.status === 'completed' || updatedDoc.status === 'failed') {
            clearInterval(pollInterval);
            setDocuments(prev => prev.map(doc => 
              doc._id === id ? updatedDoc : doc
            ));
            if (updatedDoc.status === 'completed') {
              setSuccess('Document processing completed');
            } else {
              setError(updatedDoc.error || 'Document processing failed');
            }
          } else {
            // Update progress based on some heuristic
            setProcessingProgress(prev => Math.min(prev + 10, 90));
          }
        } catch (err) {
          clearInterval(pollInterval);
          setError('Error checking document status');
        }
      }, 2000);
    } catch (err) {
      setError('Error processing document');
      console.error(err);
    }
  };

  const handleViewDetails = (doc) => {
    setSelectedDoc(doc);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/documents/${id}`);
      setDocuments(prev => prev.filter(doc => doc._id !== id));
      setSuccess('Document deleted successfully');
    } catch (err) {
      setError('Error deleting document');
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Documents
      </Typography>

      {/* Upload Area */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          mb: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop the PDF here' : 'Drag and drop a PDF file here, or click to select'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Maximum file size: 10MB
        </Typography>
      </Paper>

      {/* Documents List */}
      <List>
        {documents.map((doc) => (
          <ListItem
            key={doc._id}
            secondaryAction={
              <Box>
                <IconButton 
                  edge="end" 
                  onClick={() => handleProcess(doc._id)}
                  disabled={doc.status === 'processing'}
                >
                  {doc.status === 'processing' ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton 
                  edge="end" 
                  onClick={() => handleViewDetails(doc)}
                  disabled={doc.status !== 'completed'}
                >
                  <MusicNote />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(doc._id)}>
                  <Delete />
                </IconButton>
              </Box>
            }
          >
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText
              primary={doc.originalName}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    Status: {doc.status}
                  </Typography>
                  {doc.status === 'processing' && (
                    <LinearProgress 
                      variant="determinate" 
                      value={processingProgress} 
                      sx={{ mt: 1 }}
                    />
                  )}
                  <br />
                  <Typography component="span" variant="body2">
                    Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Document Details Dialog */}
      <Dialog 
        open={!!selectedDoc} 
        onClose={() => setSelectedDoc(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedDoc && (
          <>
            <DialogTitle>Document Details</DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
                {selectedDoc.originalName}
              </Typography>
              
              {selectedDoc.musicTimeline && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Background Music Timeline
                  </Typography>
                  <List>
                    {selectedDoc.musicTimeline.music.map((music, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <MusicNote />
                        </ListItemIcon>
                        <ListItemText
                          primary={music.description}
                          secondary={`${music.startTime}s - ${music.endTime}s`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Sound Effects
                  </Typography>
                  <List>
                    {selectedDoc.musicTimeline.effects.map((effect, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <VolumeUp />
                        </ListItemIcon>
                        <ListItemText
                          primary={effect.description}
                          secondary={`At ${effect.timestamp}s`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {selectedDoc.audioChunks && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Audio Preview
                  </Typography>
                  <audio controls>
                    <source src={selectedDoc.audioChunks[0].url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedDoc(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Loading Indicator */}
      {uploading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error/Success Messages */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Documents; 
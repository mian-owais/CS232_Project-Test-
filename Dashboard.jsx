import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Button, IconButton, Tooltip, CircularProgress, LinearProgress, Alert } from '@mui/material';
import { Delete, PlayArrow, CloudUpload } from '@mui/icons-material';
import { motion } from 'framer-motion';
import PDFUpload from '../upload/PDFUpload';
import PDFAudioPlayer from '../player/PDFAudioPlayer'; // Updated to use PDFAudioPlayer
import { uploadPDF, getPDFDocuments, deletePDFDocument, convertPDFToAudio } from '../../services/pdfService';

const MotionCard = motion(Card);

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(undefined);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [convertingDocId, setConvertingDocId] = useState(null);
  const [convertProgress, setConvertProgress] = useState(0);
  const [convertError, setConvertError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const docs = await getPDFDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setConvertError('Failed to load documents.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(undefined);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const document = await uploadPDF(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setDocuments([...documents, document]);
      
      // Reset upload state after a short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePDFDocument(id);
      setDocuments(documents.filter(doc => doc._id !== id));
      if (selectedDocument?._id === id) {
        setSelectedDocument(null);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      setConvertError('Failed to delete document.');
    }
  };

  const handleConvert = async (id) => {
    try {
      setConvertingDocId(id);
      setConvertProgress(0);
      setConvertError(null);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setConvertProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);

      const updatedDoc = await convertPDFToAudio(id);
      clearInterval(progressInterval);
      setConvertProgress(100);
      
      setDocuments(documents.map(doc => 
        doc._id === id ? updatedDoc : doc
      ));
      if (selectedDocument?._id === id) {
        setSelectedDocument(updatedDoc);
      }

      // Reset conversion state after a delay
      setTimeout(() => {
        setConvertingDocId(null);
        setConvertProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error converting document:', error);
      setConvertError('Failed to convert PDF to audio.');
      setConvertingDocId(null);
      setConvertProgress(0);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (selectedDocument) {
    return (
      <PDFAudioPlayer 
        pdfUrl={selectedDocument.url} 
        audioUrl={selectedDocument.audioUrl} 
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={4}>
        <Typography variant="h4" component="h1">
          PDF to Audio Converter
        </Typography>

        {convertError && (
          <Alert severity="error">{convertError}</Alert>
        )}

        <PDFUpload
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          uploadError={uploadError}
        />

        <Grid container spacing={3}>
          {documents.map((document) => (
            <Grid item xs={12} sm={6} md={4} key={document._id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={2}>
                    <Typography variant="h6" noWrap>
                      {document.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Uploaded: {
                        document.uploadDate && !isNaN(new Date(document.uploadDate))
                          ? new Date(document.uploadDate).toLocaleDateString()
                          : (document.createdAt && !isNaN(new Date(document.createdAt))
                              ? new Date(document.createdAt).toLocaleDateString()
                              : 'Unknown Date')
                      }
                    </Typography>
                    {convertingDocId === document._id && (
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress variant="determinate" value={convertProgress} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Converting... {convertProgress}%
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => setSelectedDocument(document)}
                        disabled={!document.audioUrl || convertingDocId === document._id}
                      >
                        Play
                      </Button>
                      {!document.audioUrl && (
                        <Button
                          variant="outlined"
                          startIcon={<CloudUpload />}
                          onClick={() => handleConvert(document._id)}
                          disabled={!!convertingDocId}
                        >
                          Convert
                        </Button>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(document._id)}
                          sx={{ ml: 'auto' }}
                          disabled={!!convertingDocId}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default Dashboard;
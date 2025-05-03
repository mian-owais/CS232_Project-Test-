import { useState, useCallback } from 'react';
import { Box, Paper, Typography, Button, CircularProgress, LinearProgress } from '@mui/material';
import { CloudUpload, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const PDFUpload = ({ onUpload, isUploading, uploadProgress = 0, uploadError }) => {
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    const file = acceptedFiles[0];
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size should be less than 10MB');
      return;
    }

    setFileName(file.name);
    try {
      await onUpload(file);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        p: 4,
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          cursor: isUploading ? 'default' : 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: isUploading ? 'grey.300' : 'primary.main',
            backgroundColor: isUploading ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
          },
        }}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography>Uploading {fileName}...</Typography>
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {uploadProgress}% complete
              </Typography>
            </Box>
          </Box>
        ) : uploadError ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <ErrorIcon color="error" sx={{ fontSize: 48 }} />
            <Typography color="error">{uploadError}</Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h6">
              {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF here'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to select a file
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Maximum file size: 10MB
            </Typography>
          </Box>
        )}
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </MotionPaper>
  );
};

export default PDFUpload; 
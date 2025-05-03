import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  IconButton,
  Slider,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  alpha,
  Chip,
  Tooltip,
  CircularProgress,
  Grid,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
  Speed,
  Bookmark,
  NoteAdd,
  Highlight,
  Share,
  Download,
  AutoFixHigh,
  Translate
} from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const MotionPaper = motion(Paper);

const PDFAudioPlayer = ({ pdfUrl, audioUrl }) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [notes, setNotes] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [isTakingNote, setIsTakingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioError, setAudioError] = useState(null);
  const audioRef = useRef(null);
  const pdfRef = useRef(null);

  // Initialize Gemini API (replace with your actual API key)
  const genAI = new GoogleGenerativeAI('AIzaSyC9njGx5BbmHeXy6rdQNXtH1fsQAee7nMc');

  // Load and initialize audio
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.oncanplay = () => {
        console.log('Audio ready to play');
        setAudioError(null);
      };
      audioRef.current.onerror = () => {
        const errorMsg = `Failed to load audio: ${audioRef.current?.error?.message || 'Unknown error'}`;
        console.error(errorMsg);
        setAudioError(errorMsg);
      };
    }
    // Cleanup on unmount or audioUrl change
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [audioUrl]);

  // Update duration when metadata is loaded
  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioUrl) {
      setAudioError('No audio available. Please convert the PDF to audio first.');
      return;
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Playback error:', error);
          setAudioError('Failed to play audio: ' + error.message);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      // Update current page based on time (assuming 30 seconds per page)
      const page = Math.floor(audioRef.current.currentTime / 30) + 1;
      setCurrentPage(Math.min(page, numPages || 1));
    }
  };

  const handleVolumeChange = (event, newValue) => {
    const volume = newValue;
    setVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = volume === 0;
    }
    setIsMuted(volume === 0);
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleAddNote = () => {
    if (noteText.trim() && audioRef.current) {
      const newNote = {
        id: Date.now().toString(),
        text: noteText,
        timestamp: audioRef.current.currentTime,
        page: currentPage
      };
      setNotes([...notes, newNote]);
      setNoteText('');
      setIsTakingNote(false);
    }
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() && audioRef.current) {
      const newHighlight = {
        id: Date.now().toString(),
        text: selection.toString(),
        startTime: audioRef.current.currentTime,
        endTime: audioRef.current.currentTime + 5, // 5 seconds duration
        page: currentPage
      };
      setHighlights([...highlights, newHighlight]);
    }
  };

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Summarize the following PDF content in 3 key points: ${notes.map(note => note.text).join(' ')}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Generated Summary:', text);
      // TODO: Display summary in a modal or update state
    } catch (error) {
      console.error('Error generating summary:', error);
    }
    setIsGeneratingSummary(false);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  return (
    <Box sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={3} sx={{ flex: 1 }}>
        {/* PDF Viewer */}
        <Grid item xs={12} md={8}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              p: 3,
              height: '100%',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              overflow: 'auto'
            }}
          >
            <Box ref={pdfRef} sx={{ position: 'relative' }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<CircularProgress />}
                  onLoadError={(error) => console.error('PDF load error:', error)}
                >
                  <Page
                    pageNumber={currentPage}
                    width={pdfRef.current?.clientWidth}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              )}
              {highlights.map(highlight => (
                highlight.page === currentPage && (
                  <Box
                    key={highlight.id}
                    sx={{
                      position: 'absolute',
                      background: alpha(theme.palette.primary.main, 0.2),
                      borderRadius: 1,
                      p: 0.5
                    }}
                  >
                    {highlight.text}
                  </Box>
                )
              ))}
            </Box>
          </MotionPaper>
        </Grid>

        {/* Controls and Notes */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Audio Player */}
            <MotionPaper
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <Stack spacing={2}>
                {audioError && (
                  <Alert severity="error">{audioError}</Alert>
                )}
                {!audioUrl && (
                  <Alert severity="warning">No audio available. Please convert the PDF to audio.</Alert>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
                  </Typography>
                </Box>
                <Slider
                  value={currentTime}
                  max={duration}
                  onChange={(_, value) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = value;
                    }
                  }}
                  disabled={!audioUrl}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Tooltip title="Playback Speed">
                    <IconButton onClick={() => handlePlaybackRateChange(playbackRate === 1 ? 0.5 : 1)} disabled={!audioUrl}>
                      <Speed />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Previous">
                    <IconButton disabled={!audioUrl}>
                      <SkipPrevious />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={isPlaying ? "Pause" : "Play"}>
                    <IconButton onClick={handlePlayPause} size="large" disabled={!audioUrl}>
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Next">
                    <IconButton disabled={!audioUrl}>
                      <SkipNext />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                    <IconButton onClick={() => setIsMuted(!isMuted)} disabled={!audioUrl}>
                      {isMuted ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  disabled={!audioUrl}
                />
              </Stack>
            </MotionPaper>

            {/* Notes Section */}
            <MotionPaper
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                flex: 1,
                overflow: 'auto'
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Notes</Typography>
                  <Button
                    startIcon={<NoteAdd />}
                    onClick={() => setIsTakingNote(true)}
                    variant="outlined"
                    size="small"
                  >
                    Add Note
                  </Button>
                </Box>
                {isTakingNote && (
                  <Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Type your note here..."
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button onClick={handleAddNote} variant="contained">
                        Save
                      </Button>
                      <Button onClick={() => setIsTakingNote(false)}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
                <List>
                  {notes.map((note) => (
                    <ListItem key={note.id}>
                      <ListItemText
                        primary={note.text}
                        secondary={`Page ${note.page} - ${Math.floor(note.timestamp / 60)}:${(note.timestamp % 60).toFixed(0).padStart(2, '0')}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </MotionPaper>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Highlight Text">
                <IconButton onClick={handleHighlight}>
                  <Highlight />
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate Summary">
                <IconButton onClick={generateSummary} disabled={isGeneratingSummary || !notes.length}>
                  {isGeneratingSummary ? <CircularProgress size={24} /> : <AutoFixHigh />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Translate">
                <IconButton>
                  <Translate />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton>
                  <Share />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download">
                <IconButton>
                  <Download />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </Box>
  );
};

export default PDFAudioPlayer;
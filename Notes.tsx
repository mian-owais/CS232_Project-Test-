import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Edit,
    Delete,
    Share,
    ColorLens,
    Pin,
    History,
    Add
} from '@mui/icons-material';
import axios from 'axios';

interface Note {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    category: string;
    isPinned: boolean;
    color: string;
    collaborators: Array<{
        user: {
            _id: string;
            username: string;
        };
        role: string;
    }>;
    lastModified: string;
}

const Notes: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [shareDialog, setShareDialog] = useState(false);
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [collaboratorRole, setCollaboratorRole] = useState('viewer');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get('/api/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleCreateNote = async () => {
        try {
            const response = await axios.post('/api/notes', {
                title: 'New Note',
                content: '',
                category: 'personal'
            });
            setNotes([response.data, ...notes]);
            setSelectedNote(response.data);
            setOpenDialog(true);
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    const handleUpdateNote = async () => {
        if (!selectedNote) return;

        try {
            const response = await axios.put(`/api/notes/${selectedNote._id}`, selectedNote);
            setNotes(notes.map(note => 
                note._id === selectedNote._id ? response.data : note
            ));
            setSelectedNote(response.data);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
            await axios.delete(`/api/notes/${noteId}`);
            setNotes(notes.filter(note => note._id !== noteId));
            if (selectedNote?._id === noteId) {
                setSelectedNote(null);
                setOpenDialog(false);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleAddTag = () => {
        if (!selectedNote || !newTag.trim()) return;

        const updatedNote = {
            ...selectedNote,
            tags: [...selectedNote.tags, newTag.trim()]
        };
        setSelectedNote(updatedNote);
        setNewTag('');
    };

    const handleRemoveTag = (tag: string) => {
        if (!selectedNote) return;

        const updatedNote = {
            ...selectedNote,
            tags: selectedNote.tags.filter(t => t !== tag)
        };
        setSelectedNote(updatedNote);
    };

    const handleShareNote = async () => {
        if (!selectedNote) return;

        try {
            await axios.post(`/api/notes/${selectedNote._id}/collaborators`, {
                userId: collaboratorEmail,
                role: collaboratorRole
            });
            const response = await axios.get(`/api/notes/${selectedNote._id}`);
            setSelectedNote(response.data);
            setShareDialog(false);
            setCollaboratorEmail('');
            setCollaboratorRole('viewer');
        } catch (error) {
            console.error('Error sharing note:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Notes List */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Notes</Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleCreateNote}
                            >
                                New Note
                            </Button>
                        </Box>
                        <List>
                            {notes.map((note) => (
                                <ListItem
                                    key={note._id}
                                    button
                                    selected={selectedNote?._id === note._id}
                                    onClick={() => {
                                        setSelectedNote(note);
                                        setOpenDialog(true);
                                    }}
                                    sx={{
                                        borderLeft: `4px solid ${note.color}`,
                                        mb: 1
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {note.isPinned && <Pin sx={{ mr: 1, fontSize: 16 }} />}
                                                {note.title}
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                {note.tags.map(tag => (
                                                    <Chip
                                                        key={tag}
                                                        label={tag}
                                                        size="small"
                                                        sx={{ mr: 0.5 }}
                                                    />
                                                ))}
                                            </Box>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNote(note._id);
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Note Editor */}
                <Grid item xs={12} md={8}>
                    {selectedNote && (
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <TextField
                                    fullWidth
                                    value={selectedNote.title}
                                    onChange={(e) => setSelectedNote({
                                        ...selectedNote,
                                        title: e.target.value
                                    })}
                                    variant="standard"
                                    sx={{ mb: 2 }}
                                />
                                <Box>
                                    <IconButton onClick={() => setSelectedNote({
                                        ...selectedNote,
                                        isPinned: !selectedNote.isPinned
                                    })}>
                                        <Pin color={selectedNote.isPinned ? 'primary' : 'inherit'} />
                                    </IconButton>
                                    <IconButton onClick={() => setShareDialog(true)}>
                                        <Share />
                                    </IconButton>
                                    <IconButton>
                                        <History />
                                    </IconButton>
                                </Box>
                            </Box>

                            <TextField
                                fullWidth
                                multiline
                                rows={10}
                                value={selectedNote.content}
                                onChange={(e) => setSelectedNote({
                                    ...selectedNote,
                                    content: e.target.value
                                })}
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Tags
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                    {selectedNote.tags.map(tag => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            onDelete={() => handleRemoveTag(tag)}
                                        />
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        size="small"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add tag"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddTag}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={selectedNote.category}
                                        onChange={(e) => setSelectedNote({
                                            ...selectedNote,
                                            category: e.target.value
                                        })}
                                        label="Category"
                                    >
                                        <MenuItem value="personal">Personal</MenuItem>
                                        <MenuItem value="work">Work</MenuItem>
                                        <MenuItem value="education">Education</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    onClick={handleUpdateNote}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </Paper>
                    )}
                </Grid>
            </Grid>

            {/* Share Dialog */}
            <Dialog open={shareDialog} onClose={() => setShareDialog(false)}>
                <DialogTitle>Share Note</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="User Email"
                        value={collaboratorEmail}
                        onChange={(e) => setCollaboratorEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={collaboratorRole}
                            onChange={(e) => setCollaboratorRole(e.target.value)}
                            label="Role"
                        >
                            <MenuItem value="viewer">Viewer</MenuItem>
                            <MenuItem value="editor">Editor</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShareDialog(false)}>Cancel</Button>
                    <Button onClick={handleShareNote} variant="contained">
                        Share
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Notes; 
import React, { useState } from 'react';
import { useNotes } from '@/context/NotesContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const NoteModal = ({ note, onClose }) => {
  const { addNote, updateNote } = useNotes();
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    if (note.id) {
      updateNote({ ...note, title, content, timestamp });
    } else {
      const id = Date.now().toString();
      addNote({ id, title, content, timestamp });
    }
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle> {note.id ? 'Edit Note' : 'Add Note'} </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ backgroundColor: '#f0f0f0', color: '#000' }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} style={{ backgroundColor: '#1976d2', color: '#fff' }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteModal;

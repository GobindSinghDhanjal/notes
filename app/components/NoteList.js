"use client";
import React, { useState } from 'react';
import { useNotes } from '@/context/NotesContext';
import NoteModal from './NoteModal';
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton, Pagination, Paper, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const NoteList = () => {
  const { notes, deleteNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalNote, setModalNote] = useState(null);
  const [viewNote, setViewNote] = useState(null);
  const notesPerPage = 10;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (note) => {
    setModalNote(note);
  };

  const handleDelete = (id) => {
    deleteNote(id);
  };

  const handleViewNote = (note) => {
    setViewNote(note);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort notes by timestamp in descending order
  const sortedNotes = filteredNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Pagination logic
  const startIndex = (currentPage - 1) * notesPerPage;
  const paginatedNotes = sortedNotes.slice(startIndex, startIndex + notesPerPage);
  const totalPages = Math.ceil(sortedNotes.length / notesPerPage);

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <TextField
          label="Search notes..."
          variant="outlined"
          fullWidth
          onChange={handleSearch}
          value={searchQuery}
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalNote({ title: '', content: '' })}
        >
          Add Note
        </Button>
      </Paper>
      <List>
        {paginatedNotes.map((note) => (
          <ListItem
            key={note.id}
            divider
            button
            onClick={() => handleViewNote(note)}
          >
            <ListItemText
              primary={note.title}
              secondary={
                <>
                  {note.content.substring(0, 100)}...
                  <br />
                  <span style={{ fontSize: '0.875rem', color: 'gray' }}>
                    Last modified: {new Date(note.timestamp).toLocaleString()}
                  </span>
                </>
              }
            />
            <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(note); }} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }} color="error">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />
      {modalNote && <NoteModal note={modalNote} onClose={() => setModalNote(null)} />}
      {viewNote && (
        <Dialog open={!!viewNote} onClose={() => setViewNote(null)}>
          <DialogTitle>{viewNote.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{viewNote.content}</Typography>
            <Typography variant="caption" color="textSecondary">
              Last modified: {new Date(viewNote.timestamp).toLocaleString()}
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default NoteList;

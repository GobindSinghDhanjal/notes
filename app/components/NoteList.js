"use client";
import React, { useState } from "react";
import { Card, CardContent, CardActions, Grid } from "@mui/material";
import { useNotes } from "@/context/NotesContext";
import NoteModal from "./NoteModal";
import {
  Container,
  TextField,
  Button,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const NoteList = () => {
  const { notes, deleteNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
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
  const sortedNotes = filteredNotes.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * notesPerPage;
  const paginatedNotes = sortedNotes.slice(
    startIndex,
    startIndex + notesPerPage
  );
  const totalPages = Math.ceil(sortedNotes.length / notesPerPage);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Container sx={{ flex: 1, marginBottom: 10 }}>
        <Button
          className="custom-button"
          onClick={() => setModalNote({ title: "", content: "" })}
        >
          Add Note
        </Button>
        <TextField
          label="Search notes..."
          variant="outlined"
          fullWidth
          onChange={handleSearch}
          value={searchQuery}
          className="custom-textfield"
        />

        <Grid container spacing={2}>
          {paginatedNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card
                onClick={() => handleViewNote(note)}
                className="card"
                variant="outlined"
              >
                <CardContent className="card-content">
                  <Typography className="card-title" variant="h6">
                    {note.title}
                  </Typography>
                  <Typography variant="body2">
                    {note.content.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions className="card-actions">
                  <div className="card-timestamp-container">
                    <Typography variant="caption" className="card-timestamp">
                      {formatDate(note.timestamp)}
                    </Typography>
                  </div>
                  <div className="card-icons">
                    <IconButton
                      onClick={() => handleViewNote(note)}
                      className="edit-icon"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
        className="pagination"
      />
      {modalNote && (
        <NoteModal note={modalNote} onClose={() => setModalNote(null)} />
      )}
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
    </div>
  );
};

export default NoteList;

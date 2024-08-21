"use client";
import React, { useState } from "react";
import { Card, CardContent, CardActions, Grid, useTheme, useMediaQuery } from "@mui/material";
import { useNotes } from "@/context/NotesContext";
import { AnimatePresence, motion } from "framer-motion";
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

  const dialogVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "95vh" }}
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
                {" "}
                <motion.div layoutId={note.id}>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(note);
                        }}
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
                </motion.div>
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
        <AnimatePresence>
          <Dialog
            open={!!viewNote}
      onClose={() => setViewNote(null)}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: motion.div,
        variants: dialogVariants,
        initial: "hidden",
        animate: "visible",
        exit: "exit",
        style: {
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          color: "#ffffff",
          borderRadius: 16,
          maxHeight:"50%",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          margin:"5%",
        },
      }}
          >
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogTitle
                style={{
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Light text shadow
                }}
              >
                {viewNote.title}
              </DialogTitle>
              <DialogContent
                style={{
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Light text shadow
                }}
              >
                <Typography variant="body1">{viewNote.content}</Typography>
                <br />
                <Typography variant="caption" color="#d1d1d1">
                  Last modified: {formatDate(viewNote.timestamp)}
                </Typography>
              </DialogContent>
            </motion.div>
          </Dialog>
        </AnimatePresence>
      )}
    </div>
  );
};

export default NoteList;

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const NotesContext = createContext();

export const useNotes = () => {
  return useContext(NotesContext);
};

const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  if (typeof window !== "undefined") {
    if (localStorage.getItem("notes") === null) {
      localStorage.setItem("notes", JSON.stringify([]));
    }
  }

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []);

  useEffect(() => {
    if (notes.length === 0) {
      console.log("");
    } else {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = (note) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };

  const updateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.filter((note) => note.id !== id);
      if (updatedNotes.length === 0) {
        localStorage.removeItem("notes");
      } else {
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
      }

      return updatedNotes;
    });
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export default NotesProvider;

import NotesProvider from "@/context/NotesContext";
import NoteList from "./components/NoteList";

export default function Home() {
  return (
    <NotesProvider>
      <div>
        <NoteList />
      </div>
    </NotesProvider>
  );
}

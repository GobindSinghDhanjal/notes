import NotesProvider from "@/context/NotesContext";
import NoteList from "./components/NoteList";
import Header from "./components/Header";

export default function Home() {
  return (
    <NotesProvider>
      <div>
        <Header />
        <NoteList />
      </div>
    </NotesProvider>
  );
}

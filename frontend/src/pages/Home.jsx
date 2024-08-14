import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "../axios";
import { Button, Textarea, Card } from "flowbite-react";

const Home = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState(user?.notes || []);
  const [currentNote, setCurrentNote] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  useEffect(() => {
    setNotes(user?.notes || []);
  }, [user]);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setFormTitle("");
      setFormContent("");
      setCurrentNote(null);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (currentNote) {
        // Update note
        await axios.put(`/notes/${currentNote.id}`, {
          title: formTitle,
          content: formContent,
        });
        const updatedNotes = notes.map((note) =>
          note.id === currentNote.id
            ? { ...note, title: formTitle, content: formContent }
            : note
        );
        setNotes(updatedNotes);
      } else {
        // Add new note
        const { data } = await axios.post("/notes", {
          title: formTitle,
          content: formContent,
        });
        setNotes([...notes, data]);
      }
      toggleForm();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleEdit = (note) => {
    setCurrentNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error(
        "Error deleting note:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <div className="mx-auto text-2xl font-bold text-slate-600 mb-2">Notes</div>

      <div className="w-100 bg-slate-200 p-2 rounded-md">
        <button onClick={toggleForm} className="bg-slate-700 p-2 rounded-md text-blue-50 mb-2">
          {currentNote ? "Edit Note" : "Add Note"}
        </button>
        {showForm && (
        <form
          onSubmit={handleAddOrUpdate}
          className="bg-slate-300 p-2 mx-auto rounded-md"
        >
          <div className="flex flex-col gap-2 mb-2">
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Note title"
              required
            />
            <Textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Notes..."
              required
              rows={4}
              className="resize-none"
            />
            <button type="submit" className="bg-slate-700 text-slate-50 p-2 rounded-md">
              {currentNote ? "Update Note" : "Submit"}
            </button>
          </div>
        </form>
      )}

      </div>

     
      <div className="section flex gap-2 mt-2 flex-wrap">
        {notes.map((note) => (
          <Card key={note.id} className="max-w-sm lg:w-3/12 w-full">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">
              {note.title}
            </h5>
            <p className="font-normal text-gray-700">{note.content}</p>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => handleEdit(note)} className="bg-orange-300">
                Edit
              </Button>
              <Button onClick={() => handleDelete(note.id)} className="bg-red-300">
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Home;

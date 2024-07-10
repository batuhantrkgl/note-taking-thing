import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout'; // Assuming Layout.js is in components folder
import styles from '../styles/Home.module.css';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to the scroll height
    }
  }, [note]);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      console.log('Fetched notes:', data);
      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes([]);
    }
  };

  const saveNote = async () => {
    if (!note) return;
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newNote = await response.json();
      setNotes([...notes, newNote]);
      setNote('');
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const sortedNotes = notes
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <Layout>
      <div className={styles.container}>
        <textarea
          ref={textareaRef}
          value={note}
          onChange={handleNoteChange}
          placeholder="Write your note here..."
          className={styles.textarea}
        ></textarea>
        <button onClick={saveNote} className={styles.button}>
          Save Note
        </button>
        <div className={styles.notesContainer}>
          {sortedNotes.map(({ id, content, timestamp }, index) => (
            <div key={id || index} className={styles.note}>
              <p>{content || 'No content available'}</p>
              <p className={styles.timestamp}>
                Saved At:{' '}
                {timestamp && !isNaN(new Date(timestamp).getTime())
                  ? new Date(timestamp).toLocaleString()
                  : 'Invalid timestamp'}
              </p>
              <button onClick={() => deleteNote(id)} className={styles.deleteButton}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

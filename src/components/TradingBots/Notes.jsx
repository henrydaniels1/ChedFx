import { useState, useEffect } from 'react';
import Delete from '../../icons/Delete'

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');

  // Load notes from localStorage when the component mounts
  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes && storedNotes !== '[]') {
      try {
        const parsedNotes = JSON.parse(storedNotes);
        console.log('Loaded notes from localStorage:', parsedNotes); // Debug log
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Failed to parse stored notes:', error);
      }
    } else {
      console.log('No notes found in localStorage or notes are empty.');
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    console.log('Saving notes to localStorage:', notes); // Debugging log
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (note.trim()) {
      console.log('Adding note:', note); // Debugging log
      setNotes((prevNotes) => [...prevNotes, note]);
      setNote(''); // Clear the input
    }
  };

  const deleteNote = (index) => {
    console.log('Deleting note at index:', index); // Debugging log
    setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 rounded-2xl space-y-16">
      <h1 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-8">Daily Trading Notes</h1>
     
      <div className="mb-4 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-none bg-opacity-10 border border-gray-100 p-4 rounded-lg">
         <h1 className="text-2xl font-bold mb-4 text-white">Add Notes</h1>
        <textarea
          className="w-full p-2 border rounded-lg"
          rows="4"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note here..."
        ></textarea>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={addNote}
        >
          Add Note
        </button>
      </div>


      <div className='bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-none bg-opacity-10 border border-gray-100 p-4 rounded-lg'>
        <h2 className="text-xl font-bold mb-2 text-white">Your Notes:</h2>
        <ul className="list-disc pl-5 space-y-4  ">
          {notes.map((n, index) => (
            <li key={index} className="mb-1 flex justify-between text-white ">
              {n}
              <button
                className="ml-2 text-white hover:text-red-700"
                onClick={() => deleteNote(index)}
              >
               <Delete/>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NoteApp;

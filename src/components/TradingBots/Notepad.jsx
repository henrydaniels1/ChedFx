
import { useRef, useState, useEffect } from 'react';
import { firestore } from './firebase';
import { addDoc, collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';


export default function Notepad() {
  const messageRef = useRef(); // Reference for the input field
  const [messages, setMessages] = useState([]); // State to hold messages
  const messagesRef = collection(firestore, 'messages'); // Firestore collection reference

  // Function to save a message to Firestore
  const handleSave = async (e) => {
    e.preventDefault();

    const data = {
      message: messageRef.current.value,
      createdAt: new Date(),
    };

    try {
      await addDoc(messagesRef, data);
      messageRef.current.value = ''; // Clear input after saving
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  // Function to delete a message from Firestore
  const handleDelete = async (id) => {
    try {
      const messageDocRef = doc(firestore, 'messages', id);
      await deleteDoc(messageDocRef); // Delete the message document
      console.log(`Document with ID ${id} deleted`);
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  // Fetch and listen for real-time updates from Firestore
  useEffect(() => {
    const q = query(messagesRef, orderBy('createdAt', 'desc')); // Query to order by createdAt
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages); // Set the fetched messages to state
    });

    return () => unsubscribe(); // Clean up listener when the component unmounts
  }, []);

  return (
    <div className="bg-green-200 p-4 rounded-lg">
      <form onSubmit={handleSave} className="flex flex-col space-y-6">
        <label>Enter note</label>
        <input type="text" ref={messageRef} className="p-2 rounded-lg" placeholder="Write a note..." />
        <div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
            Save
          </button>
        </div>
      </form>

      {/* Render the messages */}
      <div className="mt-6">
        <h2 className="font-bold text-xl">Saved Notes</h2>
        <ul className="mt-4 space-y-2">
          {messages.map((msg) => (
            <li key={msg.id} className="p-2 bg-gray-100 rounded-md flex justify-between items-center">
              <div>
                <p>{msg.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(msg.createdAt.seconds * 1000).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(msg.id)} // Trigger delete function with note ID
                className="bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

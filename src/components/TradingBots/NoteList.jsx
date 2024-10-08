import  { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot } from "firebase/firestore";

const NoteList = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'notes'), (snapshot) => {
      const notesData = [];
      snapshot.forEach((doc) => notesData.push({ ...doc.data(), id: doc.id }));
      setNotes(notesData);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="mt-6 max-w-md mx-auto">
      {notes.length > 0 ? (
        notes.map((note) => (
          <div key={note.id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            {note.content}
          </div>
        ))
      ) : (
        <p className="text-gray-600">No notes available</p>
      )}
    </div>
  );
};

export default NoteList;


// import  { useState, useEffect } from 'react';
// import { db } from './firebase';
// import { collection, onSnapshot } from "firebase/firestore";

// const NoteList = () => {
//   const [notes, setNotes] = useState([]);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, 'notes'), (snapshot) => {
//       const notesData = [];
//       snapshot.forEach((doc) => notesData.push({ ...doc.data(), id: doc.id }));
//       setNotes(notesData);
//     });
//     return unsubscribe;
//   }, []);

//   return (
//     <div className="mt-6 max-w-md mx-auto">
//       {notes.length > 0 ? (
//         notes.map((note) => (
//           <div key={note.id} className="bg-gray-100 p-4 mb-4 rounded shadow">
//             <p>{note.content}</p>
//             {note.imageURL && (
//               <img src={note.imageURL} alt="Uploaded file" className="mt-2 max-w-full h-auto rounded" />
//             )}
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-600">No notes available</p>
//       )}
//     </div>
//   );
// };

// export default NoteList;

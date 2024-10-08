import  { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

const NoteForm = () => {
  const [note, setNote] = useState('');

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (note.trim()) {
      await addDoc(collection(db, 'notes'), { content: note });
      setNote(''); // Clear the input field
    }
  };

  return (
    <form onSubmit={handleAddNote} className="bg-white shadow-md rounded p-6 max-w-md mx-auto">
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your note here..."
        className="w-full border border-gray-300 p-2 rounded mb-4"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Note
      </button>
    </form>
  );
};

export default NoteForm;


// import  { useState } from 'react';
// import { db, storage } from './firebase';
// import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// const NoteForm = () => {
//   const [note, setNote] = useState('');
//   const [file, setFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const handleAddNote = async (e) => {
//     e.preventDefault();

//     let fileURL = '';

//     if (file) {
//       const storageRef = ref(storage, 'images/' + file.name);
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on('state_changed', 
//         (snapshot) => {
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setUploadProgress(progress);
//         }, 
//         (error) => {
//           console.error("Error uploading file:", error);
//         }, 
//         async () => {
//           fileURL = await getDownloadURL(uploadTask.snapshot.ref);
//           saveNoteToFirestore(fileURL);  // Once the image is uploaded, save the note
//         }
//       );
//     } else {
//       saveNoteToFirestore(fileURL);
//     }
//   };

//   const saveNoteToFirestore = async (fileURL) => {
//     if (note.trim()) {
//       await addDoc(collection(db, 'notes'), { content: note, imageURL: fileURL });
//       setNote('');  // Clear the input field
//       setFile(null);  // Clear file input
//       setUploadProgress(0);  // Reset upload progress
//     }
//   };

//   return (
//     <form onSubmit={handleAddNote} className="bg-white shadow-md rounded p-6 max-w-md mx-auto">
//       <input
//         type="text"
//         value={note}
//         onChange={(e) => setNote(e.target.value)}
//         placeholder="Write your note here..."
//         className="w-full border border-gray-300 p-2 rounded mb-4"
//       />
//       <input
//         type="file"
//         onChange={(e) => setFile(e.target.files[0])}
//         className="w-full mb-4"
//       />
//       {uploadProgress > 0 && (
//         <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
//           <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
//         </div>
//       )}
//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         Add Note
//       </button>
//     </form>
//   );
// };

// export default NoteForm;

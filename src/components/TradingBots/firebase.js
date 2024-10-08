// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDX6Y7MHWwJ3YdxidOoV2u0qDapP8Ra3PY",
//   authDomain: "ched-fx.firebaseapp.com",
//   projectId: "ched-fx",
//   storageBucket: "ched-fx.appspot.com",
//   messagingSenderId: "752730151225",
//   appId: "1:752730151225:web:185afaca7caff7f7d5b0e8",
//   measurementId: "G-HVLTZ94129"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX6Y7MHWwJ3YdxidOoV2u0qDapP8Ra3PY",
  authDomain: "ched-fx.firebaseapp.com",
  projectId: "ched-fx",
  storageBucket: "ched-fx.appspot.com",
  messagingSenderId: "752730151225",
  appId: "1:752730151225:web:185afaca7caff7f7d5b0e8",
  measurementId: "G-HVLTZ94129"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

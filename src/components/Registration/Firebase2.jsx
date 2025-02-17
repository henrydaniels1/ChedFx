import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3nNh6HzR8olPuEolgnYUaF8pftzDZKnc",
  authDomain: "chedfx2.firebaseapp.com",
  projectId: "chedfx2",
  storageBucket: "chedfx2.appspot.com",
  messagingSenderId: "276533906798",
  appId: "1:276533906798:web:821fb7e4ff3cea84f9057f",
  measurementId: "G-P73514LFFE"
};
const app = initializeApp( firebaseConfig );
const auth = getAuth( app )

export { auth}
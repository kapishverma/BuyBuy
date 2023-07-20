import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACbhVaU7arw_728nhM5dl4p_ftbfoN_7E",
  authDomain: "buybusy-4487a.firebaseapp.com",
  projectId: "buybusy-4487a",
  storageBucket: "buybusy-4487a.appspot.com",
  messagingSenderId: "702219839024",
  appId: "1:702219839024:web:b0818fc90b296a40476ff5"
};

// // //~ Initialize Cloud Firestore and get a reference to the service

// const firebaseConfig = {
//   apiKey: "AIzaSyBnCU921r3MANdxWiWWv8JpmqEwsCigOnc",
//   authDomain: "buybuy-6aaee.firebaseapp.com",
//   projectId: "buybuy-6aaee",
//   storageBucket: "buybuy-6aaee.appspot.com",
//   messagingSenderId: "995876160168",
//   appId: "1:995876160168:web:fec209857783e1a5cdf89d"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Use your provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDba17ybV3s_h6gcZSP1-9nGgaALc1_2Pk",
  authDomain: "lifelog-f2904.firebaseapp.com",
  projectId: "lifelog-f2904",
  storageBucket: "lifelog-f2904.appspot.com",
  messagingSenderId: "341732508688",
  appId: "1:341732508688:android:4063fe724164fa1c18f695"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

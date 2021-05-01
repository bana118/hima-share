import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

import firebase from "firebase/app";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// initializeを複数回走らせない
console.log(process.env);
if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
}

const db = firebase.firestore();
const auth = firebase.auth();
export { db, auth };

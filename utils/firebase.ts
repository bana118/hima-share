import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

import firebase from "firebase/app";

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// initializeを複数回走らせない
if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
}

const db = firebase.firestore();
const auth = firebase.auth();
export { db, auth };

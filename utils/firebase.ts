import "firebase/auth";
import "firebase/database";
import "firebase/analytics";
import "firebase/app-check";

import firebase from "firebase/app";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// initializeを複数回走らせない
if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
  if (
    process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY != null &&
    typeof window !== "undefined"
  ) {
    firebase.appCheck().activate(process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY);
  }
}

const db = firebase.database();
const auth = firebase.auth();
const analytics = firebase.analytics;
export { db, auth, analytics };

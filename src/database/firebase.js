import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage';

const Config = {
  apiKey: "AIzaSyBBPkqMLNGGuV0H8sxyXcoPZnRpnGbsQLg",
  authDomain: "my-web-3f28e.firebaseapp.com",
  databaseURL: "https://my-web-3f28e.firebaseio.com",
  projectId: "my-web-3f28e",
  storageBucket: "my-web-3f28e.appspot.com",
  messagingSenderId: "365046715258",
  appId: "1:365046715258:web:9283a49c2e18ff7f643cc3",
  measurementId: "G-DE8EGXPWHT",
};

if (!firebase.apps.length) {
  firebase.initializeApp(Config);
}

// const db = firebaseApp.firestore();
const db = firebase.firestore();
export default db;

export const auth = firebase.auth();
export const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = db.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    const userDocument = await db.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

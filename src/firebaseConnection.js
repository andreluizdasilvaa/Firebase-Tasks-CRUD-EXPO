import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "[__SECRET__]",
  authDomain: "[__SECRET__]",
  projectId: "[__SECRET__]",
  storageBucket: "[__SECRET__]",
  messagingSenderId: "[__SECRET__]",
  appId: "[__SECRET__]"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth };
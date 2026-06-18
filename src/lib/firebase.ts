import { getAnalytics, isSupported } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  isSignInWithEmailLink,
  setPersistence,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseEnvKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_MEASUREMENT_ID",
];

export const firebaseConfigured = firebaseEnvKeys.every((key) => Boolean(import.meta.env[key]));

function readFirebaseEnv(key: string) {
  const value = import.meta.env[key];

  if (!value) {
    console.warn(`Missing Firebase environment variable: ${key}. Firebase-backed features may be unavailable.`);
    return "local-preview-placeholder";
  }

  return value;
}

export const firebaseConfig = {
  apiKey: readFirebaseEnv("VITE_FIREBASE_API_KEY"),
  authDomain: readFirebaseEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: readFirebaseEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: readFirebaseEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readFirebaseEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: readFirebaseEnv("VITE_FIREBASE_APP_ID"),
  measurementId: readFirebaseEnv("VITE_FIREBASE_MEASUREMENT_ID"),
};

export const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const authPersistenceReady = setPersistence(auth, browserLocalPersistence);
export const analyticsReady = firebaseConfigured ? isSupported().then((supported) => (supported ? getAnalytics(firebaseApp) : null)) : Promise.resolve(null);
export const adminEmail = "olerblaine@gmail.com";
export const applicantEmailStorageKey = "gamboxApplicantEmailForSignIn";

export async function signInMember(email: string, password: string) {
  await authPersistenceReady;
  return signInWithEmailAndPassword(auth, email, password);
}

export async function createMember(email: string, password: string) {
  await authPersistenceReady;
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const displayName = email.split("@")[0] || "Gambox Member";

  await updateProfile(credential.user, { displayName });
  return credential;
}

export async function ensureAnonymousApplicant() {
  await authPersistenceReady;

  if (auth.currentUser) return auth.currentUser;

  const credential = await signInAnonymously(auth);
  return credential.user;
}

export async function sendApplicantSignInLink(email: string) {
  await authPersistenceReady;

  const trimmedEmail = email.trim();
  const origin = window.location.origin;

  await sendSignInLinkToEmail(auth, trimmedEmail, {
    url: `${origin}/careers`,
    handleCodeInApp: true,
  });

  window.localStorage.setItem(applicantEmailStorageKey, trimmedEmail);
}

export function isApplicantSignInLink(url = window.location.href) {
  return isSignInWithEmailLink(auth, url);
}

export async function completeApplicantSignInLink(email: string, url = window.location.href) {
  await authPersistenceReady;

  const credential = await signInWithEmailLink(auth, email.trim(), url);
  window.localStorage.removeItem(applicantEmailStorageKey);
  return credential;
}

export function signOutMember() {
  return signOut(auth);
}

export async function getMemberAdminStatus(user: User | null) {
  if (!user || user.isAnonymous) return false;

  return user.email?.toLowerCase() === adminEmail;
}

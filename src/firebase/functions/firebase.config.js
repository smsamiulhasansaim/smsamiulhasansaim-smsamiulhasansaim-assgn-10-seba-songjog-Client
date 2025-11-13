import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXjA8jBYQNgC-kCCDN63ev4J_6-IHYkdA",
  authDomain: "seba-songjog.firebaseapp.com",
  projectId: "seba-songjog",
  storageBucket: "seba-songjog.firebasestorage.app",
  messagingSenderId: "432314554133",
  appId: "1:432314554133:web:193d3bfc3df1428009fb1c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Auth providers
export const githubProvider = new GithubAuthProvider();
export const googleProvider = new GoogleAuthProvider();

export default app;

import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import firebase from "firebase/app";
import "firebase/auth";

// Add your Firebase credentials
if (!firebase.apps.length)
  firebase.initializeApp({
    apiKey: "AIzaSyBAai17SRsA84DleGwT5vEQ-m7CSHJMGVc",
    authDomain: "my-next-chat-app.firebaseapp.com",
    projectId: "my-next-chat-app",
    storageBucket: "my-next-chat-app.appspot.com",
    messagingSenderId: "147004223934",
    appId: "1:147004223934:web:70e7cf0f62ff34eec049ef",
    measurementId: "G-CBJRZY33J8",
  });

const initialContext: ReturnType<typeof useProvideAuth> = {
  user: undefined,
  signin: undefined,
  signup: undefined,
  signout: undefined,
  googleSignIn: undefined,
  sendPasswordResetEmail: undefined,
  confirmPasswordReset: undefined,
};

const auth = firebase.auth();
const authContext = createContext(initialContext);

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }: { children: ReactNode }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => useContext(authContext);

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(auth.currentUser);
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.

  const signin = async (email: string, password: string) => {
    const { user } = await auth.signInWithEmailAndPassword(email, password);
    setUser(user);
    return user;
  };

  const signup = async (email: string, password: string) => {
    const { user } = await auth.createUserWithEmailAndPassword(email, password);
    setUser(user);
    return user;
  };

  const signout = async () => {
    await auth.signOut();
    return setUser(null);
  };

  const googleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
    setUser(user);
    return user;
  };

  const sendPasswordResetEmail = (email: string) => {
    return auth.sendPasswordResetEmail(email);
    //   .then(() => true);
  };

  const confirmPasswordReset = (code: string, password: string) => {
    return auth.confirmPasswordReset(code, password);
    //   .then(() => true);
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      setUser,
      console.log,
      console.log
    );
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    googleSignIn,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}

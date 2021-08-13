import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "styles/home.module.sass";
import { useAuth } from "src/auth";
import firebase from "firebase/app";
import "firebase/firestore";

export default function Home() {
  const auth = useAuth();

  if (!auth.user) {
    return (
      <div className="flex-center">
        <Head>
          <title>Demo Chat App</title>
          <meta name="description" content="Chat app by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <button onClick={() => auth.googleSignIn()}>Sign In</button>
      </div>
    );
  }

  if (auth.user) {
    const { user } = auth;
    // const store = firebase.firestore();
    // const collection = store.collection("chats");
    return (
      <div className={styles.container}>
        <Head>
          <title>Demo Chat App</title>
          <meta name="description" content="Chat app by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1>{user.displayName}</h1>
        <h2>{user.email}</h2>
        <Image src={user.photoURL} width={48} height={48}></Image>
        <aside>{}</aside>
      </div>
    );
  }
}

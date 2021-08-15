import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "styles/home.module.sass";
import { useAuth } from "src/auth";
import firebase from "firebase/app";
import "firebase/firestore";
import { useState } from "react";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { Data } from "react-firebase-hooks/firestore/dist/firestore/types";

interface userData extends Data<firebase.firestore.DocumentData, "", ""> {
  name: string;
  email: string;
  phone: string;
  photo: string;
}

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
    return (
      <div className={styles.container}>
        <Head>
          <title>Demo Chat App</title>
          <meta name="description" content="Chat app by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Main />
        <nav>
          <Link href="/"> Contactos </Link>
          <Link href="/chat">Chat</Link>
        </nav>
      </div>
    );
  }

  function Main() {
    const { user } = auth;
    const store = firebase.firestore();
    const userColection = store.collection("users");
    const [users, loading, error] = useCollectionDataOnce(userColection);
    console.log(users, loading, error);

    store
      .collection("users")
      .doc(user.uid)
      .get()
      .then((snap) => {
        snap.exists ||
          store.collection("users").doc(user.uid).set({
            name: user.displayName,
            email: user.email,
            phone: user.phoneNumber,
            photo: user.photoURL,
          });
      });

    return (
      <main>
        {users &&
          users.map((user: userData, key) => {
            return (
              <Link href={"/chats/" + user.name} key={key}>
                <a className="contact">
                  <Image
                    src={user.photo}
                    alt="avatar"
                    width={48}
                    height={48}
                  ></Image>
                  <p>{user.name}</p>
                  <i>{user.phone || user.email}</i>
                </a>
              </Link>
            );
          })}
      </main>
    );
  }
}

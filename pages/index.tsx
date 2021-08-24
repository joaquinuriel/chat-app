import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "styles/home.module.sass";
import { useAuth } from "src/auth";
import firebase from "firebase/app";
import "firebase/firestore";
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
  const store = firebase.firestore();

  if (!auth.user) {
    return (
      <div className="flex-center">
        <Head>
          <title>Demo Chat App</title>
          <meta name="description" content="Chat app by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <button
          onClick={() => {
            if (auth.googleSignIn) {
              auth.googleSignIn().then((user) => {
                const atSign = user.email.indexOf("@");
                const email = user.email.slice(0, atSign);
                store.collection("users").doc(email).set({
                  name: user.displayName,
                  email: user.email,
                  phone: user.phoneNumber,
                  photo: user.photoURL,
                });
              });
            } else {
              alert("error");
              console.log(auth);
            }
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  if (auth.user) {
    return (
      <div>
        <Head>
          <title>Demo Chat App</title>
          <meta name="description" content="Chat app by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ChatBox />
        <nav>
          <Link href="/"> Contactos </Link>
          <Link href="/chat">Chat</Link>
        </nav>
      </div>
    );
  }

  function ChatBox() {
    const store = firebase.firestore();
    const userColection = store.collection("users");
    const [users, loading, error] = useCollectionDataOnce(userColection);

    return error ? (
      <main>
        <h1>Error 😅</h1>
      </main>
    ) : loading ? (
      <main>
        <h1>Loading...</h1>
      </main>
    ) : users?.length ? (
      <main>
        {users.map((user: userData, key) => {
          if (user.email === auth.user.email) return;
          const atSign = user.email.indexOf("@");
          const email = user.email.slice(0, atSign);
          return (
            <Link href={"/chats/" + email} key={key}>
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
    ) : (
      <main>
        <h1>No Users...</h1>
      </main>
    );

    if (error)
      return (
        <main>
          <h1>Error 😅</h1>
        </main>
      );

    if (loading)
      return (
        <main>
          <h1>Loading...</h1>
        </main>
      );

    if (users && users.length) {
      return (
        <main>
          {users.map((user: userData, key) => {
            if (user.email === auth.user.email) return;
            const atSign = user.email.indexOf("@");
            const email = user.email.slice(0, atSign);
            return (
              <Link href={"/chats/" + email} key={key}>
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
    } else
      return (
        <main>
          <h1>No Users...</h1>
        </main>
      );
  }
}

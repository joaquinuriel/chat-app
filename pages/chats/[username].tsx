import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeftIcon,
  DotsHorizontalIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/solid";
import { PaperClipIcon } from "@heroicons/react/outline";
import Menu from "src/menu";
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuth } from "src/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Chat() {
  const auth = useAuth();
  const store = firebase.firestore();
  const router = useRouter();
  var { username } = router.query;
  const query = store.collection("users").doc(auth.user.uid).collection(username as string)
  const [messages] = useCollectionData(query);
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState("");
  const handleClick = () => {
    store
      .collection("users")
      .doc(auth.user.uid)
      .collection(username as string)
      .add({
        text: content,
        username: auth.user.displayName,
        uid: auth.user.uid,
        date: new Date(),
      });
  };
  const [photo, setPhoto] = useState("");
  // store
  //   .collection("users")
  //   .where("name", "==", username)
  //   .get()
  //   .then((snap) => {
  //     // setPhoto(snap);
  //     console.log(snap);
  // });

  return (
    <>
      <header>
        <Link href="/">
          <ArrowLeftIcon />
        </Link>
        <h1>{username}</h1>
        <button onClick={() => setVisible(true)}>
          <DotsHorizontalIcon />
        </button>
      </header>
      {/* <Menu visible={visible} photo={null} />  */}
      <main>
      {messages &&
          messages.map((msg, key) => (
            <div
              key={key}
              className={`message ${
                msg.uid === auth.user.uid ? "sent" : "received"
              }`}
            >
              <p>{msg.text}</p>
              <i>{msg.username}</i>
            </div>
          ))}
      </main>
      <footer>
        <PaperClipIcon />
        <input type="text" onChange={(e) => setContent(e.target.value)} />
        <button onClick={handleClick}>
          <PaperAirplaneIcon />
        </button>
      </footer>
    </>
  );
}

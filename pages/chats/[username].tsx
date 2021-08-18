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
import {
  useCollectionData,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";

export default function Chat() {
  const router = useRouter();
  var { username } = router.query;
  const auth = useAuth();
  const store = firebase.firestore();

  const ChatBox = () => {
    const collection = store.collection("users");
    const doc = collection.doc(auth.user.uid);
    const [messages] = useCollectionData(doc.collection(username as string));
    return (
      <main>
        {messages &&
          messages.map((msg, key) => {
            const sent = msg.uid === auth.user.uid;
            const classname = `message ${sent ? "sent" : "received"}`;
            return (
              <div key={key} className={classname}>
                <p>{msg.text}</p>
                {msg.uid !== auth.user.uid && <i>{msg.username}</i>}
              </div>
            );
          })}
      </main>
    );
  };

  // const query =
  //   auth.user &&
  //   store
  //     .collection("users")
  //     .doc(auth.user.uid)
  //     .collection(username as string);

  // const [messages] = useCollectionData(query);
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState("");


  // const query =
  //   auth.user &&
  //   store
  //     .collection("users")
  //     .doc(auth.user.uid)
  //     .collection(username as string);
  // const [messages] = auth.user ? useCollectionData(query) : [null];

  // const [photo, setPhoto] = useState("");

  // if (auth.user) {
  const handleClick = () => {
    auth.user &&
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

  if (!auth.user) return <Link href="/">home</Link>;

  // const userphoto = useDocumentDataOnce()

  return (
    <>
      <header>
        <Link href="/" passHref>
          <ArrowLeftIcon />
        </Link>
        <h1>{username}</h1>
        <button onClick={() => setVisible(true)}>
          <DotsHorizontalIcon />
        </button>
      </header>
      <Menu visible={visible} name={username} />
      <ChatBox />
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

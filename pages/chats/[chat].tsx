import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeftIcon,
  DotsHorizontalIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/solid";
import { PaperClipIcon } from "@heroicons/react/outline";
import Menu from "src/menu";
// import PopUp from "src/popup";
import { createRef, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuth } from "src/auth";
import {
  useCollectionData,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";

export default function Chat() {
  const router = useRouter();
  const { chat } = router.query;
  const auth = useAuth();
  const store = firebase.firestore();
  const col = store.collection("users");
  const doc = col.doc(chat as string);
  const [chatingUserData] = useDocumentDataOnce(doc);
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => void !auth.user && router.push("/"));

  // const ChatBox = () => {
  const { user } = auth;
  const atSign = user && user.email.indexOf("@");
  const email = user && user.email.slice(0, atSign);
  const collection = user && store.collection("chats");
  const [first, second] = user ? [chat, email].sort() : [null, null];
  const _doc = user && collection.doc(first + second);
  const _col = user && _doc.collection("chat");
  const query = user && _col.orderBy("date");
  const [messages] = useCollectionData(query || null);

  if (!auth.user) return <main></main>;

  // if (error) {
  //   return (
  //     <main>
  //       <h1>Error</h1>
  //       <Link href="/">Home</Link>
  //     </main>
  //   );
  // }

  // if (messages) {
  //   return (
  //     <main>
  //       {messages.map((msg, key) => {
  //         const sent = msg.uid === auth.user.uid;
  //         const classname = `message ${sent ? "sent" : "received"}`;
  //         return (
  //           <div key={key} className={classname}>
  //             <p>{msg.text}</p>
  //             {msg.uid !== auth.user.uid && <i>{msg.username}</i>}
  //           </div>
  //         );
  //       })}
  //     </main>
  //   );
  // } else return <main></main>;
  // };

  // const [popUpVisible, setPopUpVisible] = useState(false);

  // const atSign = auth.user.email.indexOf("@");
  // const email = auth.user.email.slice(0, atSign);
  // const [first, second] = [chat, email].sort();

  const handleChange = (e) => {
    setContent(e.target.value);
  };
  const handleSend = async () => {
    content &&
      store
        .collection("chats")
        .doc(first + second)
        .collection("chat")
        .add({
          text: content,
          username: auth.user.displayName,
          uid: auth.user.uid,
          date: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => setContent(""))
        .catch(console.log);
  };

  // const handleImport = () => {};

  // const userphoto = useDocumentDataOnce()
  const menuBtnRef = createRef<HTMLButtonElement>();
  // const popUpBtnRef = createRef<HTMLButtonElement>();

  return (
    <>
      <header>
        <Link href="/">
          <a>
            <ArrowLeftIcon />
          </a>
        </Link>
        <h1>{chat}</h1>
        <button ref={menuBtnRef} onClick={() => setVisible(true)}>
          <DotsHorizontalIcon />
        </button>
      </header>
      <Menu
        name={chatingUserData?.name}
        email={chatingUserData?.email}
        photo={chatingUserData?.photo}
        btn={menuBtnRef}
        visible={visible}
        onClickOut={() => setVisible(false)}
      />
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
      <footer>
        <input
          type="text"
          placeholder="mensaje..."
          value={content}
          onChange={handleChange}
        />
        <button onClick={() => handleSend()}>
          <PaperAirplaneIcon />
        </button>
      </footer>
    </>
  );
}

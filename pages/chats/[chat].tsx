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
import { createRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuth } from "src/auth";
import {
  useCollectionData,
  useDocumentDataOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";

export default function Chat() {
  const router = useRouter();
  const { chat } = router.query;
  const auth = useAuth();
  const store = firebase.firestore();
  const [chatingUserData] = useDocumentDataOnce(
    store.collection("users").doc(chat as string)
  );

  const ChatBox = () => {
    const { user } = auth;
    const atSign = user.email.indexOf("@");
    const email = user.email.slice(0, atSign);
    const collection = store.collection("users");
    const doc = collection.doc(email);
    const col = doc.collection(chat as string);
    const [messages, loading, error] = useCollectionData(col);

    if (loading) {
      return (
        <main>
          <h1>Loading...</h1>
        </main>
      );
    }

    if (messages) {
      return (
        <main>
          {messages.map((msg, key) => {
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
    }

    return <main></main>;
  };

  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState("");
  // const [popUpVisible, setPopUpVisible] = useState(false);

  const atSign = auth.user.email.indexOf("@");
  const email = auth.user.email.slice(0, atSign);

  const handleSend = () => {
    auth.user &&
      store
        .collection("users")
        .doc(email)
        .collection(router.query.user as string)
        .add({
          text: content,
          username: auth.user.displayName,
          uid: auth.user.uid,
          date: new Date(),
        });
  };

  // const handleImport = () => {};

  if (!auth.user) return <Link href="/">home</Link>;

  // const userphoto = useDocumentDataOnce()
  const menuBtnRef = createRef<HTMLButtonElement>();
  // const popUpBtnRef = createRef<HTMLButtonElement>();

  return (
    <>
      <header>
        <Link href="/" passHref>
          <ArrowLeftIcon />
        </Link>
        <h1>{router.query.user}</h1>
        <button ref={menuBtnRef} onClick={() => setVisible(true)}>
          <DotsHorizontalIcon />
        </button>
      </header>
      <Menu
        name={chatingUserData?.name || "loading"}
        email={router.query.user}
        photo={chatingUserData?.photo}
        btn={menuBtnRef}
        visible={visible}
        onClickOut={() => setVisible(false)}
      />
      <ChatBox />
      {/* <PopUp
        visible={popUpVisible}
        store={store.collection("users").doc(email)}
        onClickOut={(t) =>
          !t.contains(popUpBtnRef.current) && setPopUpVisible(false)
        }
      /> */}
      <footer>
        {/* <button ref={popUpBtnRef} onClick={() => setPopUpVisible(true)}>
          <PaperClipIcon />
        </button> */}
        <input
          type="text"
          placeholder="mensaje..."
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleSend}>
          <PaperAirplaneIcon />
        </button>
      </footer>
    </>
  );
}

import React, { useState } from "react";
import Link from "next/link";
import firebase from "firebase/app";
import "firebase/firestore";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";
import {
  ArrowLeftIcon,
  DotsHorizontalIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/solid";
import { PaperClipIcon } from "@heroicons/react/outline";
import { useAuth } from "src/auth";
// import Menu from "src/menu";

export default function Chat() {
  const auth = useAuth();
  const store = firebase.firestore();
  const query = store.collection("chat").orderBy("date");
  const [messages] = useCollectionData(query);
  const [text, setText] = useState("");
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setText(e.target.value);
  };

  const handleSend: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    text &&
      store.collection("chat").add({
        text,
        uid: auth.user.uid,
        username: auth.user.displayName,
        date: new Date(),
      });
  };

  return (
    <>
      <header>
        <Link href="/" passHref>
          <a>
            <ArrowLeftIcon />
          </a>
        </Link>
        <h1>Chat global</h1>
        {/* <button>
          <DotsHorizontalIcon />
        </button> */}
        <span style={{ width: "36px" }}></span>
      </header>
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
              {/* <i>{msg.username}</i> */}
              {msg.uid !== auth.user.uid && <i>{msg.username}</i>}
            </div>
          ))}
      </main>
      <footer>
        <input type="text" placeholder="Mensaje..." onChange={handleChange} />
        <button onClick={handleSend}>
          <PaperAirplaneIcon />
        </button>
      </footer>
    </>
  );
}

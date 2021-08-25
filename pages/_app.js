import { useEffect } from "react";
import { ProvideAuth } from "src/auth";
import "styles/globals.sass";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    navigator.serviceWorker.register("/sw.js");
    [
      document.querySelectorAll("button"),
      document.querySelectorAll("a"),
    ].forEach((el) => (el.onTouchStart = null));
  }, []);
  return (
    <ProvideAuth>
      <Component {...pageProps} />
    </ProvideAuth>
  );
}

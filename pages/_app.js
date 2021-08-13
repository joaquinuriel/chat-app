import { useEffect } from "react";
import { ProvideAuth } from "src/auth";
// import "styles/globals.sass";

export default function App({ Component, pageProps }) {
  useEffect(() => void navigator.serviceWorker.register("/sw.js"), []);
  return (
    <ProvideAuth>
      <Component {...pageProps} />
    </ProvideAuth>
  );
}

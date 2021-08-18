import Image from "next/image";
import { createRef, useState } from "react";

export default function Menu(props) {
  const [visible, setVisible] = useState(props.visible);

  const ref = createRef<HTMLElement>();
  // const handleClick = (e) => {
  //   if (ref.current && !ref.current.contains(e.target)) setVisible(false);
  // };
  // addEventListener("click", handleClick);
  return (
    <aside ref={ref} className={`menu ${visible && "visible"}`}>
      {/* <Image src={props.photo} /> */}
      <h2>{props.name}</h2>
      {/* <p>{props.email}</p> */}
      <hr />
    </aside>
  );
}

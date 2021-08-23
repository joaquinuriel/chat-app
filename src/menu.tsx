import Image from "next/image";
import { createRef, useState } from "react";

export default function Menu(props) {
  const classList = `menu ${props.visible ? "visible" : ""}`;
  const ref = createRef<HTMLElement>();
  const menuCondition = (t) => ref.current && !ref.current.contains(t);
  const btnCondition = (t) =>
    props.btn.current && !props.btn.current.contains(t);
  const handleClick = ({ target }) => {
    menuCondition(target) && btnCondition(target) && props.onClickOut();
  };
  addEventListener("click", handleClick);
  
  return (
    <aside ref={ref} className={classList}>
      {props.photo && <Image src={props.photo} />}
      <h2>{props.name}</h2>
      <p>{props.email}</p>
      <hr />
    </aside>
  );
}

import Image from "next/image";

export default function Menu(props: any) {
  return (
    <aside className={`menu ${props.visible && "visible"}`}>
      <Image src={props.photo} />
      <h2>{props.name}</h2>
      <p>{props.email}</p>
      <hr />
    </aside>
  );
}

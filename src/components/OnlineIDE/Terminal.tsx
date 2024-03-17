import { forwardRef } from "react";

interface Props {}
export type Ref = HTMLDivElement;

const Terminal = forwardRef<Ref, Props>((_, ref) => {
  return <div className="terminal" ref={ref}></div>;
});

export default Terminal;

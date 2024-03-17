import { forwardRef } from "react";
import Editorr, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
export type Ref = HTMLTextAreaElement;

const Editor = forwardRef<Ref, Props>((props, ref) => {
  return (
    <Editorr
      height="90vh"
      defaultLanguage="javascript"
      defaultValue={props?.value}
    />
  );

  return (
    <div className="editor">
      <textarea
        ref={ref}
        value={props?.value}
        onChange={props?.onChange}
      ></textarea>
    </div>
  );
});

export default Editor;

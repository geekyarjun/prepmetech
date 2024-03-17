import {
  WebContainer,
  type WebContainer as WebContainerType,
} from "@webcontainer/api";
import "xterm/css/xterm.css";
import { Terminal as XTerminal } from "xterm";
import { useRef, useState, useEffect } from "react";

// Custom Modules
import "../../App.css";
import Editor from "./Editor";
import Preview from "./Preview";
import Terminal from "./Terminal";
import { files } from "./DummyProject/files";

const OnlineIDE = () => {
  // Hooks
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const webcontainerInstanceRef = useRef<WebContainerType | null>(null);

  // State
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [textAreaValue, settextAreaValue] = useState<string>("");

  async function writeIndexJS(content: string) {
    try {
      if (webcontainerInstanceRef?.current) {
        await webcontainerInstanceRef?.current?.fs?.writeFile?.(
          "/index.js",
          content
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("In Handle Text Area Change", e);
    settextAreaValue(e?.target.value);
    writeIndexJS(e?.target.value);
  };

  async function startShell(terminal: XTerminal) {
    if (!webcontainerInstanceRef.current) return;

    const shellProcess = await webcontainerInstanceRef.current.spawn("jsh");
    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      })
    );

    const input = shellProcess.input.getWriter();
    terminal.onData((data) => {
      input.write(data);
    });

    return shellProcess;
  }

  useEffect(() => {
    async function initializeIDE() {
      try {
        // Initialize Editor
        settextAreaValue(files["index.js"].file.contents);
        if (textAreaRef.current)
          textAreaRef.current.value = files["index.js"].file.contents;

        // Initialize Terminal
        const terminal = new XTerminal({
          convertEol: true,
        });
        if (terminalRef?.current) terminal.open(terminalRef?.current);

        // 1
        webcontainerInstanceRef.current = await WebContainer.boot();
        // 2
        await webcontainerInstanceRef.current?.mount?.(files);
        // 3
        webcontainerInstanceRef.current?.on("server-ready", (port, url) => {
          console.log("server ready. Port: ", port);
          setPreviewUrl(url);
        });
        // 4
        startShell(terminal);
      } catch (error) {
        console.log(error);
      }
    }

    initializeIDE();
  }, []);

  return (
    <div className="container">
      <Editor
        ref={textAreaRef}
        value={textAreaValue}
        onChange={handleTextAreaChange}
      />
      <Preview url={previewUrl} />
      <Terminal ref={terminalRef} />
    </div>
  );
};

export default OnlineIDE;

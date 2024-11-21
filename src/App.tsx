import { useRef, useState } from "react";

import "./App.css";
import ImageControls from "./components/ImageControls";

function App() {
  const [img, setImg] = useState("");

  const downloadRef = useRef<HTMLAnchorElement>(null);

  function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files) return;

    const fileData = files[0];
    const reader = new FileReader();

    reader.addEventListener("loadend", (e) => {
      const { target } = e;

      if (!target || !target.result) throw new Error("Coudn't read file");

      setImg(target.result.toString());
    });

    reader.readAsDataURL(fileData);
  }

  return (
    <div className="container">
      <h1>Retio is small and fast SVG to PNG resizer</h1>

      <div className="actions">
        <label className="upload-btn btn" htmlFor="upload-file">
          Upload SVG
        </label>
        <input className="invisible" type="file" id="upload-file" accept=".svg" onChange={loadFile} />

        <a className="btn" ref={downloadRef}>
          Download
        </a>
      </div>

      {img !== "" && <ImageControls image={img} downloadRef={downloadRef} />}
    </div>
  );
}

export default App;

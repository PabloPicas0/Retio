import { useEffect, useRef, useState } from "react";

import "./App.css";

const MAX_DIM = 16000;

function App() {
  const [img, setImg] = useState("");
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => drawToCanvas(), [width, height]);

  function drawToCanvas() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const download = downloadRef.current;

    if (!canvas || !download || !img) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Coudn't get canvas context");

    ctx.clearRect(0, 0, width, height);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    const png = canvas.toDataURL("image/png");

    download.download = `image-w${width}-h${height}.png`;
    download.href = png;
  }

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

      <div className="dim-inputs-wrapper">
        <div>
          <label htmlFor="width">Width:</label>

          <input
            type="number"
            name="w"
            id="width"
            value={width}
            step={1}
            min={1}
            max={MAX_DIM}
            onChange={(e) => {
              const { valueAsNumber } = e.target;
              const w = valueAsNumber > MAX_DIM ? MAX_DIM : Number.isNaN(valueAsNumber) ? 0 : valueAsNumber;
              setWidth(w);
            }}
          />
        </div>

        <div>
          <label htmlFor="height">Height:</label>

          <input
            type="number"
            name="h"
            id="height"
            value={height}
            step={1}
            min={1}
            max={MAX_DIM}
            onChange={(e) => {
              const { valueAsNumber } = e.target;
              const h = valueAsNumber > MAX_DIM ? MAX_DIM : Number.isNaN(valueAsNumber) ? 0 : valueAsNumber;
              setHeight(h);
            }}
          />
        </div>
      </div>

      <div className="image-wrapper">
        <img ref={imgRef} src={img} className="invisible" onLoad={drawToCanvas} />
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default App;

import { useEffect, useRef, useState } from "react";

const MAX_DIM = 16000;

function ImageControls(props: { image: string; downloadRef: React.RefObject<HTMLAnchorElement> }) {
  const { image, downloadRef } = props;

  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <>
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
              const w = valueAsNumber > MAX_DIM ? MAX_DIM : Number.isNaN(valueAsNumber) ? 1 : valueAsNumber;
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
              const h = valueAsNumber > MAX_DIM ? MAX_DIM : Number.isNaN(valueAsNumber) ? 1 : valueAsNumber;
              setHeight(h);
            }}
          />
        </div>
      </div>

      <div className="image-wrapper">
        <img ref={imgRef} src={image} className="invisible" onLoad={drawToCanvas} />
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}

export default ImageControls;

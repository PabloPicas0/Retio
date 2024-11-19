import { useRef, useState } from "react";

const w = 800;
const h = 600;

function AddImage() {
  const [img, setImg] = useState("");
  const [factor, setFactor] = useState(0.5);

  const width = Math.floor(w * factor);
  const height = Math.floor(h * factor);

  const imgRef = useRef<HTMLImageElement>(null);

  function save() {
    const img = imgRef.current;

    if (!img) throw new Error("Image element is not rendered");

    const { width, height } = img;

    const canvas = document.createElement("canvas");
    const download = document.createElement("a")
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Coudn't get canvas context");

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    const png = canvas.toDataURL("image/png")
    
    download.download = "image.png"
    download.href = png
    download.click()
  }

  return (
    <div style={{ display: "grid", gap: 50, placeItems: "center" }}>
      <div>
        <p>width: {width}px</p>
        <p>height: {height}px</p>
      </div>

      <img ref={imgRef} src={img} width={width} height={height} />

      <input
        type="file"
        accept=".svg"
        onChange={(e) => {
          const files = e.target.files;

          if (!files) return;

          const fileData = files[0];
          const reader = new FileReader();
          reader.readAsDataURL(fileData);

          reader.addEventListener("loadend", (e) => setImg(e.target?.result + ""));
        }}
      />

      <input
        type="number"
        name="factor"
        id="factor"
        value={factor}
        step={0.01}
        min={0.01}
        max={34}
        onChange={(e) => setFactor(e.target.valueAsNumber)}
      />

      <button onClick={save}>Download</button>
    </div>
  );
}

export default AddImage;

import { useEffect, useId, useState } from "react";

function ImageUpload({ label, name = "image", required = false }) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  function handleChange(event) {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      setImage(null);
      setError("");
      return;
    }

    if (!selectedImage.type.startsWith("image/")) {
      event.target.value = "";
      setImage(null);
      setError("Choose an image file.");
      return;
    }

    setError("");
    setImage(selectedImage);
  }

  return (
    <div className="image-upload">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        name={name}
        type="file"
        accept="image/*"
        required={required}
        onChange={handleChange}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
      />
      {error && (
        <p id={errorId} className="image-upload-error" role="alert">
          {error}
        </p>
      )}
      {previewUrl && (
        <img className="image-upload-preview" src={previewUrl} alt="Selected item preview" />
      )}
    </div>
  );
}

export default ImageUpload;

import { useEffect, useId, useState } from "react";

function ImageUpload({
  label,
  name = "image",
  required = false,
  registration,
  validationError,
}) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const displayedError = error || validationError;

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
        {...registration}
        id={inputId}
        name={name}
        type="file"
        accept="image/*"
        required={required}
        onChange={(event) => {
          registration?.onChange?.(event);
          handleChange(event);
        }}
        aria-describedby={displayedError ? errorId : undefined}
        aria-invalid={Boolean(displayedError)}
      />
      {displayedError && (
        <p id={errorId} className="image-upload-error" role="alert">
          {displayedError}
        </p>
      )}
      {previewUrl && (
        <img className="image-upload-preview" src={previewUrl} alt="Selected item preview" />
      )}
    </div>
  );
}

export default ImageUpload;

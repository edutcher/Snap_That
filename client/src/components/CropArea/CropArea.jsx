import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function EditArea(props) {
  const cropperRef = useRef();
  const onCrop = () => {
    const imageElement = cropperRef.current;
    const cropper = imageElement.cropper;
    props.setCroppedImage(cropper.getCroppedCanvas().toDataURL());
  };

  return (
    <Cropper
      src={props.previewSource}
      style={{ height: 400, width: "100%" }}
      // Cropper.js options
      initialAspectRatio={16 / 9}
      guides={false}
      crop={onCrop}
      ref={cropperRef}
    />
  );
}

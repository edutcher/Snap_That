import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function EditArea(props) {
  const cropperRef = useRef();
  const { setPhotoBlob, setCroppedImage, avatar } = props;
  const onCrop = () => {
    const imageElement = cropperRef.current;
    const cropper = imageElement.cropper;
    cropper.getCroppedCanvas().toBlob((blob) => setPhotoBlob(blob));
    setCroppedImage(cropper.getCroppedCanvas().toDataURL());
  };

  return (
    <Cropper
      src={props.previewSource}
      style={{ height: 400, width: "100%" }}
      // Cropper.js options
      initialAspectRatio={1}
      guides={false}
      crop={onCrop}
      autoCrop={avatar ? true : false}
      ref={cropperRef}
      zoomOnWheel={true}
    />
  );
}

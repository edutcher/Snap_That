import React from "react";
import Dropzone from "react-dropzone";

export default function UploadArea(props) {
  return (
    <div>
      <Dropzone onDrop={props.handleFileInput}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()} style={{ borderStyle: "dashed" }}>
              <input {...getInputProps()} />
              <p style={{ marginLeft: "10px", height: "100px" }}>
                Drag 'n' drop your photo here, or click to select a photo
              </p>
            </div>
          </section>
        )}
      </Dropzone>
      {props.previewSource && (
        <div>
          <img
            src={props.previewSource}
            alt="chosen"
            style={{ height: "300px", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
}

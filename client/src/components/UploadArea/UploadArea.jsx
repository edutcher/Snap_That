import React from "react";
import Dropzone from "react-dropzone";

export default function UploadArea(props) {
  return (
    <div>
      <Dropzone onDrop={props.handleFileInput}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
      {props.previewSource && (
        <div>
          <img
            src={props.previewSource}
            alt="chosen"
            style={{ height: "300px" }}
          />
        </div>
      )}
    </div>
  );
}

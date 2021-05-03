import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Dropzone from "react-dropzone";
import { uploadPhoto } from "../utils/API.js";

export default function NewPhotoPage() {
  const [fileInput, setFileInput] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const { currentUser } = useContext(UserContext);
  const history = useHistory();

  const handleFileInput = async (file) => {
    if (file.length > 1) {
      return;
    }
    setFileInput(file[0]);
    previewFile(file[0]);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleClick = async () => {
    const photo = {
      details: {
        title: "test title",
        category: "test",
        user: currentUser.userId,
      },
      photo: previewSource,
    };
    let result = await uploadPhoto(photo);
    console.log(result);
  };

  return (
    <Container>
      <Dropzone onDrop={handleFileInput}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
      {previewSource && (
        <div>
          <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
          <Button onClick={handleClick}>Upload</Button>
        </div>
      )}
    </Container>
  );
}

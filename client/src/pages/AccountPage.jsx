import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import { Button, Container } from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { getUserInfo } from "../utils/API.js";
import PhotoList from "../components/PhotoList/PhotoList";
import ImageGrid from "../components/ImageGrid/ImageGrid";
import EditModal from "../components/EditModal/EditModal";
import AccountTabs from "../components/AccountTabs/AccountTabs";
import { deletePhoto, editPhoto } from "../utils/API.js";

export default function AccountPage() {
  const { currentUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const history = useHistory();
  const [changePhoto, setChangePhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleClose = () => {
    setOpen(false);
    setChangePhoto(null);
  };

  const getData = async () => {
    let result = await getUserInfo(currentUser.userId);
    setUserInfo(result.data);
  };

  useEffect(() => {
    if (!currentUser.userId) history.push("/");
    else getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.userId, currentUser.photos]);

  const handlePhotoClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    history.push(`/photo/${id}`);
  };

  const handleDeleteClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    deletePhoto(id);
  };

  const handleEditClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    const chosenPhoto = userInfo.photos.find((photo) => photo._id === id);
    setChangePhoto(chosenPhoto);
    setOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const result = await editPhoto(changePhoto._id, changePhoto);
    if (result.status === 200) {
      getData();
      setOpen(false);
    }
  };

  return (
    <Container>
      <h1>Hello {currentUser.username} !!!!</h1>
      <Button onClick={() => history.push("/newphoto")}>
        Add Photo <AddAPhotoIcon />{" "}
      </Button>
      {userInfo && <AccountTabs userInfo={userInfo} />}
      {false && (
        <div>
          <h4>Your Photos:</h4>
          <PhotoList
            images={userInfo.photos}
            handleDeleteClick={handleDeleteClick}
            handleEditClick={handleEditClick}
            handlePhotoClick={handlePhotoClick}
          />
          <h4>Your Favorites:</h4>
          <ImageGrid images={userInfo.favorites} fav={false} />
        </div>
      )}
      {false && (
        <EditModal
          open={open}
          handleClose={handleClose}
          changePhoto={changePhoto}
          setChangePhoto={setChangePhoto}
          newTag={newTag}
          setNewTag={setNewTag}
          handleEditSubmit={handleEditSubmit}
        />
      )}
    </Container>
  );
}

import React from "react";
import PhotoCard from "../PhotoCard/PhotoCard";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function PhotoList(props) {
  const classes = useStyles();
  const { images, handleDeleteClick, handleEditClick, handlePhotoClick } =
    props;
  return (
    <div className={classes.cardRoot}>
      {images &&
        images
          .filter((image) => image.isDeleted === false)
          .map((image) => (
            <PhotoCard
              key={image._id}
              image={image}
              handlePhotoClick={handlePhotoClick}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
            />
          ))}
    </div>
  );
}

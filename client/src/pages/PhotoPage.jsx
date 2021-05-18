import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";
import { Container, Paper, Chip } from "@material-ui/core";
import { getPhotoById } from "../utils/API.js";

const useStyles = makeStyles((theme) => ({
  chipRoot: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function PhotoPage(props) {
  const classes = useStyles();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const { id } = props.match.params;
    const getPhoto = async () => {
      const result = await getPhotoById(id);
      setPhoto(result.data);
    };
    getPhoto();

    return function cleanup() {
      setPhoto(null);
    };
  }, [props.match.params]);

  return (
    <Container>
      {photo && (
        <div>
          <h1>{photo.title}</h1>
          <h3>By: {photo.user.username}</h3>
          <img src={photo.image_url} alt={photo.title} />
          {photo.tags && (
            <Paper component="ul" className={classes.chipRoot}>
              {photo.tags.map((data) => {
                return (
                  <li key={data}>
                    <Chip label={data} className={classes.chip} />
                  </li>
                );
              })}
            </Paper>
          )}
          {photo.request && (
            <div>
              {" "}
              <h4> Request: {photo.request.text}</h4>{" "}
              <h5> by: {photo.request.user.username}</h5>
            </div>
          )}
          <span>
            Height: {photo.dimensions.height} Width: {photo.dimensions.width}
          </span>
          <Link component="a" href={photo.image_url} target="_blank" download>
            {" "}
            Download
          </Link>
        </div>
      )}
    </Container>
  );
}

import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Paper,
  Chip,
  Typography,
  Grid,
  IconButton,
  Button,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ImageGrid from "../components/ImageGrid/ImageGrid";
import { UserContext } from "../contexts/UserContext.js";
import usePhotoClicks from "../hooks/usePhotoClicks.js";
import { getPhotoById, getPhotosByCategory } from "../utils/API.js";

const useStyles = makeStyles((theme) => ({
  chipRoot: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  head: {
    margin: "30px",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  image: {
    width: `100%`,
  },
  tagPaper: {
    marginBottom: "15px",
  },
  requestBlock: {
    marginBottom: "15px",
    marginTop: "10px",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  favIcon: {
    color: "rgba(255, 0, 160, 0.54)",
  },
  imgGrid: {
    marginTop: "25px",
    marginBottom: "30px",
  },
  space: {
    padding: "50px",
  },
}));

export default function PhotoPage(props) {
  const classes = useStyles();
  const [photo, setPhoto] = useState(null);
  const [catPhotos, setCatPhotos] = useState([]);
  const [category, setCategory] = useState("");
  const { currentUser, changeUser } = useContext(UserContext);
  const { handleFavClick, handleNameClick } = usePhotoClicks(
    currentUser,
    changeUser
  );

  useEffect(() => {
    const { id } = props.match.params;

    const getCatPhotos = async (cat) => {
      const result = await getPhotosByCategory(cat);

      setCatPhotos(result.data.filter((image) => image._id !== id));
    };

    const getPhoto = async () => {
      const result = await getPhotoById(id);

      if (result.status === 200) {
        setPhoto(result.data);
        setCategory(result.data.category);
        getCatPhotos(result.data.category);
      }
    };
    getPhoto();

    return function cleanup() {
      setPhoto(null);
      setCatPhotos(null);
      setCategory(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    let favorites;
    if (photo.favorites) favorites = photo.favorites + 1;
    else favorites = 1;
    setPhoto({ ...photo, favorites });
    handleFavClick(e);
  };

  const downloadImage = async () => {
    const image = await fetch(photo.image_url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = `${photo.title}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      {photo && (
        <Grid container>
          <Grid container item xs={12}>
            <Grid item xs={6}>
              <Paper className={classes.head}>
                <Typography variant="h3" component="h3">
                  {photo.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="h5"
                  data-id={photo.user._id}
                  onClick={handleNameClick}
                  style={{ cursor: "pointer" }}
                >
                  By: {photo.user.username}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.head}>
                <Grid item xs={6}>
                  <Typography variant="h4" component="h4">
                    Favorites: {photo.favorites}
                  </Typography>
                  {photo.user.username === currentUser.username ? (
                    ""
                  ) : (
                    <IconButton
                      className={
                        currentUser.favorites
                          ? currentUser.favorites.includes(photo._id)
                            ? classes.favIcon
                            : ""
                          : ""
                      }
                      data-id={photo._id}
                      data-user={photo.user.username}
                      onClick={handleFavoriteClick}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <img
            src={photo.image_url}
            alt={photo.title}
            className={classes.image}
          />
          <Grid item xs={12} className={classes.tagPaper}>
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
          </Grid>
          <Grid item xs={12}>
            {photo.request && (
              <Paper className={classes.requestBlock}>
                <Typography variant="h5" component="h5">
                  Request: {photo.request.text}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="span"
                  data-id={photo.request.user._id}
                  style={{ cursor: "pointer" }}
                  onClick={handleNameClick}
                >
                  By: {photo.request.user.username}
                </Typography>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" component="span">
              Height: {photo.dimensions.height} Width: {photo.dimensions.width}
            </Typography>
            <Button onClick={downloadImage}>Download</Button>
          </Grid>
        </Grid>
      )}
      <div className={classes.space} />
      {catPhotos && (
        <div>
          <Typography variant="h4" component="h4">
            Other {category}:
          </Typography>
          <ImageGrid
            className={classes.imgGrid}
            images={catPhotos}
            fav={true}
          />
        </div>
      )}
      <div className={classes.space} />
    </Container>
  );
}

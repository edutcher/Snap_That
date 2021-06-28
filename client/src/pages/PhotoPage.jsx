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
  Tooltip,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import GetAppIcon from "@material-ui/icons/GetApp";
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
    backgroundColor: theme.palette.primary.main,
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
    marginTop: theme.spacing(3),
  },
  tagPaper: {
    marginBottom: theme.spacing(3),
  },
  requestBlock: {
    marginBottom: theme.spacing(3),
    marginTop: "10px",
  },
  downloadBtn: {
    background: theme.palette.primary.main,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  favIcon: {
    color: "rgba(255, 0, 160, 0.54)",
  },
  downloadIcon: {
    marginLeft: "auto",
    marginTop: theme.spacing(1),
  },
  favArea: {
    marginTop: theme.spacing(4),
  },
  dateArea: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
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
  const [photoError, setPhotoError] = useState(false);
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
      try {
        const result = await getPhotoById(id);

        console.log(result);

        if (result.status === 200) {
          setPhoto(result.data);
          setCategory(result.data.category);
          getCatPhotos(result.data.category);
          setPhotoError(false);
        }
      } catch (error) {
        setPhotoError(true);
      }
    };
    getPhoto();

    return function cleanup() {
      setPhoto(null);
      setCatPhotos(null);
      setCategory(null);
      setPhotoError(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!currentUser.username) return;
    if (currentUser.favorites.includes(photo._id)) return;
    let favorites;
    if (photo.favorites) favorites = photo.favorites + 1;
    else favorites = 1;
    setPhoto({ ...photo, favorites });
    handleFavClick(e);
  };

  const handleDownloadClick = async () => {
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
      {photo ? (
        photo.isDeleted ? (
          <Typography variant="h1" component="h1" style={{ marginTop: "50px" }}>
            We're sorry, that photo has been deleted
          </Typography>
        ) : (
          <Grid container>
            <Grid container item xs={12}>
              <Grid item xs={6}>
                <div className={classes.favArea}>
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
                </div>
              </Grid>
              <Grid item container xs={6} className={classes.favArea}>
                <Grid item>
                  {currentUser.username ? (
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
                      <FavoriteIcon fontSize="large" />
                    </IconButton>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item>
                  <Typography
                    variant="h5"
                    component="h5"
                    style={{ marginTop: "12px" }}
                  >
                    Favorites: {photo.favorites || "0"}
                  </Typography>
                </Grid>
                <Grid item className={classes.downloadIcon}>
                  <Tooltip title="Download">
                    <IconButton onClick={handleDownloadClick} fontSize="large">
                      {" "}
                      <GetAppIcon />{" "}
                    </IconButton>
                  </Tooltip>
                </Grid>
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
                <div className={classes.requestBlock}>
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
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" component="span">
                Height: {photo.dimensions.height} Width:{" "}
                {photo.dimensions.width}
              </Typography>
              <Grid item xs={12} className={classes.dateArea}>
                <Typography variant="subtitle2" component="span">
                  Created: {new Date(photo.created_on).toDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={handleDownloadClick}
                  className={classes.downloadBtn}
                >
                  Download
                </Button>
              </Grid>
            </Grid>
            <div className={classes.space} />
            {catPhotos && (
              <div>
                <Typography variant="h4" component="h4">
                  Other {category}:
                </Typography>
                <ImageGrid
                  className={classes.imgGrid}
                  images={
                    catPhotos.length > 10 ? catPhotos.slice(0, 9) : catPhotos
                  }
                />
              </div>
            )}
            <div className={classes.space} />
          </Grid>
        )
      ) : photoError ? (
        <Typography variant="h1" component="h1" style={{ marginTop: "50px" }}>
          That photo doesn't seem to exist
        </Typography>
      ) : (
        ""
      )}
    </Container>
  );
}

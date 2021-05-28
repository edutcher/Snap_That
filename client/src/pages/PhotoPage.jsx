import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";
import {
  Container,
  Paper,
  Chip,
  Typography,
  Grid,
  IconButton,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ImageGrid from "../components/ImageGrid/ImageGrid";
import { UserContext } from "../contexts/UserContext.js";
import {
  getPhotoById,
  getPhotosByCategory,
  favoritePhoto,
} from "../utils/API.js";

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

  useEffect(() => {
    const { id } = props.match.params;

    const getCatPhotos = async (cat) => {
      const result = await getPhotosByCategory(cat);
      setCatPhotos(result.data);
    };

    const getPhoto = async () => {
      const result = await getPhotoById(id);
      setPhoto(result.data);
      setCategory(result.data.category);
      getCatPhotos(result.data.category);
    };
    getPhoto();

    return function cleanup() {
      setPhoto(null);
      setCatPhotos(null);
      setCategory(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params]);

  const handleFavClick = async (e) => {
    e.stopPropagation();
    const id = e.currentTarget.getAttribute("data-id");
    const user = e.currentTarget.getAttribute("data-user");
    if (!currentUser.username) return;
    if (currentUser.favorites) {
      if (currentUser.favorites.includes(id)) return;
    }
    if (currentUser.username === user) return;
    e.currentTarget.style.setProperty("color", "rgba(255, 0, 160, 0.54)");
    const newFav = {
      photoId: id,
      userId: currentUser.userId,
    };
    if (currentUser.favorites) {
      changeUser({
        ...currentUser,
        favorites: [...currentUser.favorites, id],
      });
    } else {
      changeUser({
        ...currentUser,
        favorites: [id],
      });
    }
    const favorites = photo.favorites + 1;
    setPhoto({ ...photo, favorites });
    await favoritePhoto(newFav);
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
                <Typography variant="subtitle1" component="h5">
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
                    onClick={handleFavClick}
                  >
                    <FavoriteIcon />
                  </IconButton>
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
                <Typography variant="subtitle1" component="span">
                  By: {photo.request.user.username}
                </Typography>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12}>
            <span>
              Height: {photo.dimensions.height} Width: {photo.dimensions.width}
            </span>
            <Link component="a" href={photo.image_url} target="_blank" download>
              Download
            </Link>
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

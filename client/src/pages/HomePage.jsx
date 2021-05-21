import React, { useState, useEffect, useContext } from "react";
import Container from "@material-ui/core/Container";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LazyLoad from "react-lazyload";
import { UserContext } from "../contexts/UserContext.js";
import { useHistory } from "react-router-dom";
import { getPhotos, favoritePhoto } from "../utils/API.js";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    display: "inline",
    width: 300,
    margin: "30px",
  },
  tileImage: {
    position: "relative",
    float: "left",
    width: "100%",
    minHeight: "400px",
    maxWidth: "400px",
    overflow: "hidden",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  favIcon: {
    color: "rgba(255, 0, 160, 0.54)",
  },
  space: {
    padding: "30px",
  },
}));

export default function HomePage() {
  const classes = useStyles();
  const [cols, setCols] = useState([[], [], []]);
  const history = useHistory();
  const { currentUser, changeUser } = useContext(UserContext);

  useEffect(() => {
    const getData = async () => {
      let result = await getPhotos();
      const modThree = result.data.length % 3;
      const colSize = Math.floor(result.data.length / 3);
      if (modThree === 0) {
        setCols([
          result.data.slice(0, colSize),
          result.data.slice(colSize, colSize * 2),
          result.data.slice(colSize * 2, colSize * 3),
        ]);
      } else if (modThree === 1) {
        setCols([
          result.data.slice(0, colSize + 1),
          result.data.slice(colSize + 1, colSize * 2 + 1),
          result.data.slice(colSize * 2 + 1, colSize * 3 + 1),
        ]);
      } else {
        setCols([
          result.data.slice(0, colSize + 1),
          result.data.slice(colSize + 1, colSize * 2 + 2),
          result.data.slice(colSize * 2 + 2, colSize * 3 + 2),
        ]);
      }
    };
    getData();
  }, []);

  const handleGridClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    history.push(`/photo/${id}`);
  };

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
    await favoritePhoto(newFav);
  };

  const makeGridList = (arr) => {
    return (
      <GridList cols={1} xs={12} className={classes.gridList}>
        {arr.map((tile) => {
          const tileHeight = tile.dimensions.height;
          let styles;
          if (tileHeight > 700) {
            styles =
              tile.dimensions.width > tile.dimensions.height
                ? { height: "100%" }
                : { width: "100%" };
          } else {
            styles = { width: "100%" };
          }

          return (
            <GridListTile
              xs={12}
              key={tile._id}
              data-id={tile._id}
              rows={tileHeight > 700 ? 2 : 1}
              onClick={handleGridClick}
            >
              <LazyLoad style={{ height: "100%" }}>
                <img src={tile.image_url} alt={tile.title} style={styles} />
              </LazyLoad>
              <GridListTileBar
                title={tile.title}
                subtitle={<span>by: {tile.user.username}</span>}
                actionIcon={
                  <IconButton
                    aria-label={`info about ${tile.title}`}
                    className={
                      currentUser.favorites
                        ? currentUser.favorites.includes(tile._id)
                          ? classes.favIcon
                          : classes.icon
                        : classes.icon
                    }
                    data-id={tile._id}
                    data-user={tile.user.username}
                    onClick={handleFavClick}
                  >
                    <FavoriteIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          );
        })}
      </GridList>
    );
  };

  return (
    <Container>
      <div>
        <h1 style={{ textAlign: "center" }}>
          Snap-That <CameraEnhanceIcon />
        </h1>
      </div>
      <div className={classes.root}>
        {makeGridList(cols[0])}
        <div className={classes.space} />
        {makeGridList(cols[1])}
        <div className={classes.space} />
        {makeGridList(cols[2])}
      </div>
    </Container>
  );
}

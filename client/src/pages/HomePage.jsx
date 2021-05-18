import React, { useState, useEffect, useContext } from "react";
import Container from "@material-ui/core/Container";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
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
}));

export default function HomePage() {
  const classes = useStyles();
  const [cols, setCols] = useState([[], [], []]);
  const history = useHistory();
  const { currentUser } = useContext(UserContext);

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
    const newFav = {
      photoId: e.currentTarget.getAttribute("data-id"),
      userId: currentUser.userId,
    };
    const result = await favoritePhoto(newFav);
    console.log(result);
  };

  const makeGridList = (arr) => {
    return (
      <GridList cols={1} xs={12} className={classes.gridList}>
        {arr.map((tile) => {
          const tileHeight = tile.dimensions.height;

          return (
            <GridListTile
              xs={12}
              key={tile._id}
              data-id={tile._id}
              rows={tile.dimensions.height > 700 ? 2 : 1}
              onClick={handleGridClick}
            >
              <img
                src={tile.image_url}
                alt={tile.title}
                style={{ height: { tileHeight } }}
              />
              <GridListTileBar
                title={tile.title}
                subtitle={<span>by: {tile.user.username}</span>}
                actionIcon={
                  <IconButton
                    aria-label={`info about ${tile.title}`}
                    className={classes.icon}
                    data-id={tile._id}
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
        {makeGridList(cols[1])}
        {makeGridList(cols[2])}
      </div>
    </Container>
  );
}

// {this.state.images.map((image) => (
//   <PhotoCard key={image._id} image={image} />
// ))}

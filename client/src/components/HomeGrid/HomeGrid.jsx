import React from "react";
import {
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LazyLoad from "react-lazyload";

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
    cursor: "pointer",
  },
  tile: {
    cursor: "pointer",
  },
  tileBar: {
    cursor: "default",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  username: {
    cursor: "pointer",
  },
  favIcon: {
    color: "rgba(255, 0, 160, 0.54)",
  },
}));

export default function HomeGrid(props) {
  const {
    images,
    handleFavClick,
    handleGridClick,
    handleNameClick,
    currentUser,
  } = props;
  const classes = useStyles();

  return (
    <Grid item xs={8} s={6} md={4} lg={3}>
      <GridList
        cols={1}
        xs={12}
        s={6}
        className={classes.gridList}
        spacing={10}
      >
        {images.map((tile) => {
          const tileHeight = tile.dimensions.height;
          const tileWidth = tile.dimensions.width;
          let styles;
          if (tileHeight > 700 && tileHeight < 1800) {
            styles = { height: "100%" };
          } else {
            if (tileHeight < 700 && tileWidth > 700) {
              styles = { height: "100%" };
            } else {
              styles = { width: "100%" };
            }
          }

          return (
            <GridListTile
              xs={12}
              key={tile._id}
              data-id={tile._id}
              rows={tileHeight > 700 ? 2 : 1}
              onClick={handleGridClick}
              className={classes.tile}
            >
              <LazyLoad style={{ height: "100%" }}>
                <img src={tile.image_url} alt={tile.title} style={styles} />
              </LazyLoad>
              <GridListTileBar
                title={tile.title}
                subtitle={
                  <span
                    className={classes.username}
                    data-id={tile.user._id}
                    onClick={handleNameClick}
                  >
                    by: {tile.user.username}
                  </span>
                }
                actionIcon={
                  currentUser.username ? (
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
                  ) : (
                    ""
                  )
                }
                className={classes.tileBar}
              />
            </GridListTile>
          );
        })}
      </GridList>
    </Grid>
  );
}

import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LazyLoad from "react-lazyload";
import usePhotoClicks from "../../hooks/usePhotoClicks.js";
import { UserContext } from "../../contexts/UserContext.js";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  favIcon: {
    color: "rgba(255, 0, 160, 0.54)",
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

export default function ImageGrid(props) {
  const classes = useStyles();
  const { images, fav } = props;
  const { currentUser, changeUser } = useContext(UserContext);
  const { handleFavClick, handleGridClick } = usePhotoClicks(
    currentUser,
    changeUser
  );

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {images.map((tile) => (
          <GridListTile
            key={tile._id}
            data-id={tile._id}
            onClick={handleGridClick}
          >
            <LazyLoad style={{ height: "100%" }}>
              <img src={tile.image_url} alt={tile.title} />
            </LazyLoad>
            <GridListTileBar
              title={tile.title}
              subtitle={<span>by: {tile.user.username}</span>}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                tile.user.username === currentUser.username ? (
                  ""
                ) : fav ? (
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
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

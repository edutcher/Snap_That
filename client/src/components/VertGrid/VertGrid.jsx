import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import usePhotoClicks from "../../hooks/usePhotoClicks.js";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    maxWidth: 800,
    minWidth: 200,
  },
  image: {
    cursor: "pointer",
  },
  tileBar: {
    cursor: "default",
  },
  name: {
    cursor: "pointer",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

export default function VertGrid(props) {
  const classes = useStyles();
  const { images, profile } = props;
  const { handleGridClick, handleNameClick } = usePhotoClicks(null, null);

  return (
    <div className={classes.root}>
      <GridList cellHeight={360} className={classes.gridList}>
        {images.map((tile) => (
          <GridListTile key={tile._id}>
            <img
              data-id={tile._id}
              src={tile.image_url}
              alt={tile.title}
              onClick={handleGridClick}
              className={classes.image}
            />

            <GridListTileBar
              title={tile.title}
              className={classes.tileBar}
              subtitle={
                profile ? (
                  ""
                ) : (
                  <span
                    data-id={tile.user._id}
                    onClick={handleNameClick}
                    className={classes.name}
                  >
                    by: {tile.user.username}
                  </span>
                )
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

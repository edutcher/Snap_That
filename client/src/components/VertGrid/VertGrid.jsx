import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
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
    minWidth: 300,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

export default function VertGrid(props) {
  const classes = useStyles();
  const history = useHistory();
  const { images, profile } = props;

  const handleGridClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    history.push(`/photo/${id}`);
  };

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
            />

            <GridListTileBar
              title={tile.title}
              subtitle={profile ? "" : <span>by: {tile.user.username}</span>}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

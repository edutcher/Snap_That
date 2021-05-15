import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchPhotos } from "../utils/API.js";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";

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
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function SearchPage() {
  const classes = useStyles();
  let query = useQuery();
  const q = query.get("q");
  const [titleResults, setTitleResults] = useState([]);
  const [tagResults, setTagResults] = useState([]);

  const makeGrid = (arr) => {
    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={2.5}>
          {arr.map((tile) => (
            <GridListTile key={tile._id}>
              <img src={tile.image_url} alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  };

  useEffect(() => {
    const doSearch = async () => {
      const newQuery = {
        query: q,
      };
      const results = await searchPhotos(newQuery);
      setTitleResults(results.data.titles);
      setTagResults(results.data.tags);
    };
    doSearch();
  }, [q]);

  return (
    <Container>
      <div>
        <h1>SEARCH: {query.get("q")}</h1>
      </div>
      <h3>Title match:</h3>
      {titleResults && makeGrid(titleResults)}
      <h3>Tag match:</h3>
      {tagResults && makeGrid(tagResults)}
    </Container>
  );
}

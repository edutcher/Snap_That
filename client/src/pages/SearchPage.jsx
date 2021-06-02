import React, { useEffect, useState } from "react";
import { searchPhotos } from "../utils/API.js";
import { Container, Typography, makeStyles } from "@material-ui/core";
import ImageGrid from "../components/ImageGrid/ImageGrid";
import useQuery from "../hooks/useQuery.js";

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(5),
  },
}));

export default function SearchPage() {
  const classes = useStyles();
  let query = useQuery();
  const q = query.get("q");
  const [titleResults, setTitleResults] = useState([]);
  const [tagResults, setTagResults] = useState([]);

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
      <Typography variant="h3" component="h3" className={classes.header}>
        Search results for {q}:
      </Typography>
      <Typography variant="h5" component="h5" className={classes.header}>
        Title match:
      </Typography>
      {titleResults &&
        (titleResults.length > 0 ? (
          <ImageGrid images={titleResults} />
        ) : (
          <Typography variant="subtitle1" component="span">
            No results
          </Typography>
        ))}
      <Typography variant="h5" component="h5" className={classes.header}>
        Tag match:
      </Typography>
      {tagResults &&
        (tagResults.length > 0 ? (
          <ImageGrid images={tagResults} />
        ) : (
          <Typography variant="subtitle1" component="span">
            No results
          </Typography>
        ))}
    </Container>
  );
}

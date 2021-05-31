import React, { useEffect, useState } from "react";
import { searchPhotos } from "../utils/API.js";
import { Container, Typography } from "@material-ui/core";
import ImageGrid from "../components/ImageGrid/ImageGrid";
import useQuery from "../hooks/useQuery.js";

export default function SearchPage() {
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
      <div>
        <h1>SEARCH: {query.get("q")}</h1>
      </div>
      <h3>Title match:</h3>
      {titleResults &&
        (titleResults.length > 0 ? (
          <ImageGrid images={titleResults} fav={true} />
        ) : (
          <Typography variant="h5" component="h5">
            No results
          </Typography>
        ))}
      <h3>Tag match:</h3>
      {tagResults &&
        (tagResults.length > 0 ? (
          <ImageGrid images={tagResults} fav={true} />
        ) : (
          <Typography variant="h5" component="h5">
            No results
          </Typography>
        ))}
    </Container>
  );
}

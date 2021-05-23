import React, { useEffect, useState } from "react";
import { searchPhotos } from "../utils/API.js";
import { Container } from "@material-ui/core";
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
      {titleResults && <ImageGrid images={titleResults} fav={true} />}
      <h3>Tag match:</h3>
      {tagResults && <ImageGrid images={tagResults} fav={true} />}
    </Container>
  );
}

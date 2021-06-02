import React, { useEffect, useState } from "react";
import { getTopPhotos, getTopUsers } from "../utils/API.js";
import { Container, Typography, Grid, makeStyles } from "@material-ui/core";
import ImageGrid from "../components/ImageGrid/ImageGrid";
import TopList from "../components/TopList/TopList";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
  cont: {
    marginBottom: theme.spacing(5),
  },
}));

export default function TopPage() {
  const classes = useStyles();
  const [photoResults, setPhotoResults] = useState([]);
  const [userResults, setUserResults] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const useRes = await getTopUsers();
      setUserResults(useRes.data);
      const photoRes = await getTopPhotos();
      setPhotoResults(photoRes.data);
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className={classes.cont}>
      <Grid container>
        <Typography variant="h3" component="h3" className={classes.title}>
          Top Photos:
        </Typography>
        {photoResults &&
          (photoResults.length > 0 ? (
            <ImageGrid images={photoResults} />
          ) : (
            <Typography variant="subtitle1" component="div">
              No results
            </Typography>
          ))}
        <Grid item xs={12} lg={4}>
          <Typography variant="h5" component="h5" className={classes.title}>
            Most Favorites:
          </Typography>
          {userResults.topFavs &&
            (userResults.topFavs.length > 0 ? (
              <Grid item xs={12}>
                <TopList users={userResults.topFavs} fav={true} />
              </Grid>
            ) : (
              <Typography variant="subtitle1" component="div">
                No results
              </Typography>
            ))}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Typography variant="h5" component="h5" className={classes.title}>
            Most Requests Filled:
          </Typography>
          {userResults.mostReqs &&
            (userResults.mostReqs.length > 0 ? (
              <Grid item xs={12}>
                <TopList users={userResults.mostReqs} />
              </Grid>
            ) : (
              <Typography variant="subtitle1" component="div">
                No results
              </Typography>
            ))}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Typography variant="h5" component="h5" className={classes.title}>
            Most Photos:
          </Typography>
          {userResults.mostPhotos &&
            (userResults.mostPhotos.length > 0 ? (
              <Grid item xs={12}>
                <TopList users={userResults.mostPhotos} />
              </Grid>
            ) : (
              <Typography variant="h5" component="h5">
                No results
              </Typography>
            ))}
        </Grid>
      </Grid>
    </Container>
  );
}

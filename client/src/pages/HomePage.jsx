import React, { useState, useEffect, useContext } from "react";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Container, Typography, Link } from "@material-ui/core";
import { UserContext } from "../contexts/UserContext.js";
import { Link as RouterLink } from "react-router-dom";
import { getPhotos } from "../utils/API.js";
import HomeGrid from "../components/HomeGrid/HomeGrid.jsx";
import usePhotoClicks from "../hooks/usePhotoClicks.js";

const useStyles = makeStyles((theme) => ({
  header: {
    textAlign: "center",
    margin: "20px",
  },
}));

export default function HomePage() {
  const classes = useStyles();
  const [cols, setCols] = useState([[], [], []]);
  const { currentUser, changeUser } = useContext(UserContext);
  const { handleFavClick, handleNameClick, handleGridClick } = usePhotoClicks(
    currentUser,
    changeUser
  );

  useEffect(() => {
    const getData = async () => {
      let result = await getPhotos();
      const photos = result.data.reverse();
      const modThree = photos.length % 3;
      const colSize = Math.floor(photos.length / 3);
      if (modThree === 0) {
        setCols([
          photos.slice(0, colSize),
          photos.slice(colSize, colSize * 2),
          photos.slice(colSize * 2, colSize * 3),
        ]);
      } else if (modThree === 1) {
        setCols([
          photos.slice(0, colSize + 1),
          photos.slice(colSize + 1, colSize * 2 + 1),
          photos.slice(colSize * 2 + 1, colSize * 3 + 1),
        ]);
      } else {
        setCols([
          photos.slice(0, colSize + 1),
          photos.slice(colSize + 1, colSize * 2 + 2),
          photos.slice(colSize * 2 + 2, colSize * 3 + 2),
        ]);
      }
    };
    getData();
  }, []);

  return (
    <Container>
      <div className={classes.header}>
        <Typography
          variant="h1"
          component="h1"
          style={{ marginBottom: "15px" }}
        >
          Snap-That <CameraEnhanceIcon style={{ fontSize: 65 }} />
        </Typography>
        <Typography
          variant="subtitle1"
          component="div"
          style={{ fontSize: "1.4rem", padding: "5px" }}
        >
          A place for Royalty Free public domain images
        </Typography>
        <br />
        {currentUser.username ? (
          <Typography variant="subtitle2" component="div">
            Can't find something? Make a{" "}
            <Link component={RouterLink} to="/requests">
              Request Here
            </Link>
            <br />
            <br />
            Check out our{" "}
            <Link component={RouterLink} to="/top">
              Top photos and photographers
            </Link>
          </Typography>
        ) : (
          <Typography variant="subtitle2" component="div">
            New here?{" "}
            <Link component={RouterLink} to="/signup">
              Sign Up
            </Link>
            <br />
            <br />
            Returning?{" "}
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
        )}
      </div>
      <Grid container spacing={8} justify={"center"}>
        <HomeGrid
          handleFavClick={handleFavClick}
          handleGridClick={handleGridClick}
          handleNameClick={handleNameClick}
          currentUser={currentUser}
          images={cols[0]}
        />
        <HomeGrid
          handleFavClick={handleFavClick}
          handleGridClick={handleGridClick}
          handleNameClick={handleNameClick}
          currentUser={currentUser}
          images={cols[1]}
        />
        <HomeGrid
          handleFavClick={handleFavClick}
          handleGridClick={handleGridClick}
          handleNameClick={handleNameClick}
          currentUser={currentUser}
          images={cols[2]}
        />
      </Grid>
    </Container>
  );
}

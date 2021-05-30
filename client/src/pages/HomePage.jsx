import React, { useState, useEffect, useContext } from "react";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Container, Typography, Paper, Button } from "@material-ui/core";
import { UserContext } from "../contexts/UserContext.js";
import { useHistory } from "react-router-dom";
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
  const history = useHistory();
  const { currentUser, changeUser } = useContext(UserContext);
  const { handleFavClick, handleNameClick, handleGridClick } = usePhotoClicks(
    currentUser,
    changeUser
  );

  useEffect(() => {
    const getData = async () => {
      let result = await getPhotos();
      const modThree = result.data.length % 3;
      const colSize = Math.floor(result.data.length / 3);
      if (modThree === 0) {
        setCols([
          result.data.slice(0, colSize),
          result.data.slice(colSize, colSize * 2),
          result.data.slice(colSize * 2, colSize * 3),
        ]);
      } else if (modThree === 1) {
        setCols([
          result.data.slice(0, colSize + 1),
          result.data.slice(colSize + 1, colSize * 2 + 1),
          result.data.slice(colSize * 2 + 1, colSize * 3 + 1),
        ]);
      } else {
        setCols([
          result.data.slice(0, colSize + 1),
          result.data.slice(colSize + 1, colSize * 2 + 2),
          result.data.slice(colSize * 2 + 2, colSize * 3 + 2),
        ]);
      }
    };
    getData();
  }, []);

  const handleRequestClick = () => {
    history.push("/requests");
  };

  const handleLoginClick = () => {
    history.push("/login");
  };

  const handleSignupClick = () => {
    history.push("/signup");
  };

  return (
    <Container>
      <div className={classes.header}>
        <Typography variant="h1" component="h1">
          Snap-That <CameraEnhanceIcon style={{ fontSize: 65 }} />
        </Typography>
        <Typography variant="subtitle1" component={Paper}>
          A place for Royalty Free public domain images, Can't find something?
          make a <Button onClick={handleRequestClick}>Request</Button>
        </Typography>
        {currentUser.username ? (
          ""
        ) : (
          <Typography variant="subtitle2" component={Paper}>
            New here? <Button onClick={handleSignupClick}>Sign Up</Button>
            <br />
            Returning? <Button onClick={handleLoginClick}>Login</Button>
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

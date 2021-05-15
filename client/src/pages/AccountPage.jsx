import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { getUserInfo } from "../utils/API.js";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";

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
  image: {
    height: "100%",
    objectFit: "contain",
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

export default function AccountPage() {
  const classes = useStyles();
  const { currentUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const getData = async () => {
      let result = await getUserInfo(currentUser.userId);
      setUserInfo(result.data);
    };
    if (!currentUser.userId) history.push("/");
    else getData();
  }, []);

  return (
    <Container>
      <h1>Hello {currentUser.username} !!!!</h1>
      <Button onClick={() => history.push("/newphoto")}>
        Add Photo <AddAPhotoIcon />{" "}
      </Button>
      {userInfo && (
        <div className={classes.root}>
          <h4>Your Photos:</h4>
          <GridList className={classes.gridList} cols={2.5}>
            {userInfo.photos.map((tile) => (
              <GridListTile key={tile.image_url}>
                <img
                  src={tile.image_url}
                  alt={tile.title}
                  className={classes.image}
                />
                <GridListTileBar
                  title={tile.title}
                  classes={{
                    root: classes.titleBar,
                    title: classes.title,
                  }}
                  actionIcon={
                    <IconButton aria-label={`star ${tile.title}`}>
                      <StarBorderIcon className={classes.title} />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      )}
    </Container>
  );
}

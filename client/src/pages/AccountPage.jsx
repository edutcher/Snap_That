import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { getUserInfo } from "../utils/API.js";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import PhotoCard from "../components/PhotoCard/PhotoCard";
import ImageGrid from "../components/ImageGrid/ImageGrid";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.userId]);

  const makePhotoCards = (arr) => {
    return arr.map((image) => <PhotoCard key={image._id} image={image} />);
  };

  return (
    <Container>
      <h1>Hello {currentUser.username} !!!!</h1>
      <Button onClick={() => history.push("/newphoto")}>
        Add Photo <AddAPhotoIcon />{" "}
      </Button>
      {userInfo && (
        <div>
          <h4>Your Photos:</h4>
          <div className={classes.cardRoot}>
            {makePhotoCards(userInfo.photos)}
          </div>
          <h4>Your Favorites:</h4>
          <ImageGrid images={userInfo.favorites} fav={false} />
        </div>
      )}
    </Container>
  );
}

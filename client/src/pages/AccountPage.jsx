import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import { Button, Container, Typography, makeStyles } from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { getUserInfo } from "../utils/API.js";
import AccountTabs from "../components/AccountTabs/AccountTabs";

const useStyles = makeStyles((theme) => ({
  heading: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  addBtn: {
    fontSize: "25px",
    marginBottom: theme.spacing(3),
  },
  cont: {
    marginBottom: theme.spacing(4),
  },
}));

export default function AccountPage(props) {
  const classes = useStyles();
  const { currentUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const history = useHistory();
  const { handleThemeChange, darkMode } = props;

  const getData = async () => {
    let result = await getUserInfo(currentUser.userId);
    setUserInfo(result.data);
  };

  useEffect(() => {
    if (!currentUser.userId) history.push("/");
    else getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.userId, currentUser.photos]);

  return (
    <Container className={classes.cont}>
      <Typography variant="h2" component="h2" className={classes.heading}>
        Welcome: {currentUser.username}
      </Typography>
      <Button
        onClick={() => history.push("/newphoto")}
        className={classes.addBtn}
      >
        Add Photo <AddAPhotoIcon style={{ marginLeft: "9px" }} />
      </Button>
      {userInfo && (
        <AccountTabs
          handleThemeChange={handleThemeChange}
          darkMode={darkMode}
          userInfo={userInfo}
          getData={getData}
          currentUser={currentUser}
        />
      )}
    </Container>
  );
}

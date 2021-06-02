import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import { Button, Container, Typography } from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { getUserInfo } from "../utils/API.js";
import AccountTabs from "../components/AccountTabs/AccountTabs";

export default function AccountPage(props) {
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
    <Container>
      <Typography variant="h2" component="h2">
        Welcome {currentUser.username}
      </Typography>
      <Button
        onClick={() => history.push("/newphoto")}
        style={{ fontSize: "25px", marginBottom: "10px" }}
      >
        Add Photo <AddAPhotoIcon style={{ marginLeft: "9px" }} />
      </Button>
      {userInfo && (
        <AccountTabs
          handleThemeChange={handleThemeChange}
          darkMode={darkMode}
          userInfo={userInfo}
          getData={getData}
        />
      )}
    </Container>
  );
}

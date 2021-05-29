import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Typography } from "@material-ui/core";
import { getUserInfo } from "../utils/API.js";
import VertGrid from "../components/VertGrid/VertGrid.jsx";

const useStyles = makeStyles((theme) => ({
  userinfo: {
    textAlign: "center",
  },
}));

export default function ProfilePage(props) {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState(null);

  const getData = async (id) => {
    let result = await getUserInfo(id);
    setUserInfo(result.data);
  };

  useEffect(() => {
    const { id } = props.match.params;
    getData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Grid container justify="center">
        {userInfo && (
          <Grid item xs={12} className={classes.userinfo}>
            <Typography variant="h2" component="h2">
              {userInfo.username}
            </Typography>
            {userInfo.isEmailShown ? (
              <Typography variant="h3" component="h3">
                {userInfo.email}
              </Typography>
            ) : (
              ""
            )}
            <Typography variant="subtitle1" component="span">
              Request filled:{userInfo.requests_filled.length}
            </Typography>
            <br />
            <Typography variant="subtitle2" component="span">
              Total favorites:{userInfo.total_favorites}
            </Typography>
          </Grid>
        )}
        <Grid item>
          {userInfo && <VertGrid images={userInfo.photos} profile={true} />}
        </Grid>
      </Grid>
    </Container>
  );
}

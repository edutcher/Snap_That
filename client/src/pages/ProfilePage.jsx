import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Container, Grid, Typography } from "@material-ui/core";
import { getUserInfo } from "../utils/API.js";
import VertGrid from "../components/VertGrid/VertGrid.jsx";

const useStyles = makeStyles((theme) => ({
  userinfo: {
    textAlign: "center",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  gridBox: {
    maxWidth: "1200px",
    [theme.breakpoints.down("sm")]: {
      width: "375px",
    },
  },
  avatarIcon: {
    height: theme.spacing(7),
    width: theme.spacing(7),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(1.5),
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
          <Grid
            item
            container
            xs={12}
            className={classes.userinfo}
            justify="center"
          >
            <Grid item xs={12}>
              <Grid item container justify="center">
                {userInfo.avatar_url ? (
                  <Avatar
                    src={userInfo.avatar_url}
                    className={classes.avatarIcon}
                  />
                ) : (
                  ""
                )}
                <Typography variant="h2" component="h2">
                  {userInfo.username}
                </Typography>
              </Grid>
            </Grid>
            {userInfo.isEmailShown ? (
              <Grid item xs={12} style={{ marginBottom: "10px" }}>
                <Typography variant="h5" component="h5">
                  {userInfo.email}
                </Typography>
              </Grid>
            ) : (
              ""
            )}
            <Typography variant="subtitle1" component="span">
              Request filled: {userInfo.requests_filled.length}
            </Typography>
            <Typography
              variant="subtitle1"
              component="span"
              style={{ marginLeft: "7px" }}
            >
              Total favorites: {userInfo.total_favorites}
            </Typography>
          </Grid>
        )}
        <Grid item>
          {userInfo && (
            <div className={classes.gridBox}>
              <VertGrid
                images={userInfo.photos.filter((image) => !image.isDeleted)}
                profile={true}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

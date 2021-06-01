import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText } from "@material-ui/core";
import usePhotoClicks from "../../hooks/usePhotoClicks.js";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TopList(props) {
  const classes = useStyles();
  const { users, fav } = props;
  const { handleNameClick } = usePhotoClicks(null, null);

  return (
    <div className={classes.root}>
      <List component="nav">
        {users.map((user) => (
          <ListItem button data-id={user._id} onClick={handleNameClick}>
            <ListItemText
              primary={user.username}
              secondary={fav ? user.total_favorites : user.length}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: 15,
  },
  media: {
    height: 140,
  },
});

export default function MediaCard(props) {
  const classes = useStyles();
  const { image, handlePhotoClick, handleDeleteClick, handleEditClick } = props;

  return (
    <Card className={classes.root} id={image._id}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={image.image_url}
          title={image.title}
          data-id={image._id}
          onClick={handlePhotoClick}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {image.title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          data-id={image._id}
          onClick={handleEditClick}
          color="primary"
        >
          Edit
        </Button>
        <Button
          size="small"
          data-id={image._id}
          onClick={handleDeleteClick}
          color="primary"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

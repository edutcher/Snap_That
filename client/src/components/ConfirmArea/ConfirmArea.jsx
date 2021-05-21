import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { Button, LinearProgress } from "@material-ui/core";
import * as ml5 from "ml5";

const useStyles = makeStyles((theme) => ({
  progRoot: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  tagRoot: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function ConfirmArea(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const {
    setTags,
    setTitle,
    setCategory,
    setNewTag,
    tags,
    title,
    category,
    newTag,
    setDimensions,
    photoBlob,
    croppedImage,
  } = props;

  const photoURL = photoBlob ? window.URL.createObjectURL(photoBlob) : null;

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  function getImageDimensions(file) {
    return new Promise(function (resolved, rejected) {
      var i = new Image();
      i.onload = function () {
        resolved({ width: i.width, height: i.height });
      };
      i.src = file;
    });
  }

  const classifyImg = async () => {
    var newDimensions = await getImageDimensions(croppedImage);
    setDimensions(newDimensions);
    // Initialize the Image Classifier method with MobileNet
    const classifier = ml5.imageClassifier("MobileNet", modelLoaded);
    // When the model is loaded
    function modelLoaded() {
      const image = document.getElementById("image");
      // Make a prediction with a selected image
      classifier.predict(image, 5, function (err, results) {
        const labels = results.map((item) => item.label);
        setLoading(false);
        setTags(labels);
      });
    }
  };

  useEffect(() => {
    classifyImg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (chipToDelete) => () => {
    setTags((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTagChange = (e) => {
    setNewTag(e.target.value);
  };

  const handleAddTag = () => {
    if (tags.length > 4) {
      return;
    } else {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  return (
    <div className={classes.tagRoot}>
      {photoURL && (
        <div>
          <img
            id="image"
            src={photoURL}
            alt="chosen"
            style={{ height: "300px" }}
          />
        </div>
      )}
      <Grid container>
        <Grid item xs={12} sm={6}>
          <TextField
            id="title"
            name="title"
            label="Title"
            value={title}
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl required className={classes.formControl}>
            <InputLabel id="demo-simple-select-required-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              value={category}
              onChange={handleCategoryChange}
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Places"}>Places</MenuItem>
              <MenuItem value={"People"}>People</MenuItem>
              <MenuItem value={"Animals"}>Animals</MenuItem>
              <MenuItem value={"Items"}>Items</MenuItem>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            id="newTag"
            name="newTag"
            value={newTag}
            label="Tags"
            onChange={handleTagChange}
          />
        </Grid>
        <Grid>
          <Button onClick={handleAddTag}>Add Tag</Button>
        </Grid>
      </Grid>
      {loading ? (
        <div className={classes.progRoot}>
          <LinearProgress />
        </div>
      ) : (
        <Paper component="ul" className={classes.tagRoot}>
          {tags.map((data) => {
            return (
              <li key={data}>
                <Chip
                  label={data}
                  onDelete={handleDelete(data)}
                  className={classes.chip}
                />
              </li>
            );
          })}
        </Paper>
      )}
    </div>
  );
}

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Chip,
} from "@material-ui/core";

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

export default function EditModal(props) {
  const classes = useStyles();
  const {
    open,
    handleClose,
    changePhoto,
    setChangePhoto,
    newTag,
    setNewTag,
    handleEditSubmit,
  } = props;

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "title":
        setChangePhoto({ ...changePhoto, title: value });
        break;
      case "category":
        setChangePhoto({ ...changePhoto, category: value });
        break;
      default:
        break;
    }
  };

  const handleTagChange = (e) => {
    setNewTag(e.target.value);
  };

  const handleAddTag = () => {
    if (changePhoto.tags.length > 4) {
      return;
    } else {
      setChangePhoto({ ...changePhoto, tags: [...changePhoto.tags, newTag] });
      setNewTag("");
    }
  };

  const handleDeleteTag = (tagToDelete) => () => {
    const newTags = changePhoto.tags.filter((tag) => tag !== tagToDelete);
    setChangePhoto({ ...changePhoto, tags: newTags });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Photo</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit Photo</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            required
            value={changePhoto.title}
            onChange={handleChange}
            fullWidth
          />
          <FormControl required className={classes.formControl}>
            <InputLabel id="demo-simple-select-required-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              value={changePhoto.category}
              onChange={handleChange}
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
          <TextField
            id="newTag"
            name="newTag"
            value={newTag}
            label="Tags"
            onChange={handleTagChange}
          />
          <Button onClick={handleAddTag}>Add Tag</Button>
          <Paper component="ul" className={classes.tagRoot}>
            {changePhoto.tags.map((data) => {
              return (
                <li key={data}>
                  <Chip
                    label={data}
                    onDelete={handleDeleteTag(data)}
                    className={classes.chip}
                  />
                </li>
              );
            })}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Tab,
  Tabs,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  Checkbox,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SettingsIcon from "@material-ui/icons/Settings";
import PhotoList from "../PhotoList/PhotoList";
import VertGrid from "../VertGrid/VertGrid";
import EditModal from "../EditModal/EditModal";
import { deletePhoto, editPhoto, changeEmailShown } from "../../utils/API.js";
import UserRequestTable from "../UserRequestTable/UserRequestTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: 1200,
  },
}));

export default function AccountTabs(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const history = useHistory();
  const [changePhoto, setChangePhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const { userInfo, getData, handleThemeChange, darkMode } = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleClose = () => {
    setOpen(false);
    setChangePhoto(null);
  };

  const handlePhotoClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    history.push(`/photo/${id}`);
  };

  const handleDeleteClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    deletePhoto(id);
  };

  const handleEditClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    const chosenPhoto = userInfo.photos.find((photo) => photo._id === id);
    setChangePhoto(chosenPhoto);
    setOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const result = await editPhoto(changePhoto._id, changePhoto);
    if (result.status === 200) {
      getData();
      setOpen(false);
    }
  };

  const handleEmailChange = async () => {
    let tempObj = { isEmailShown: !userInfo.isEmailShown };
    const result = await changeEmailShown(userInfo._id, tempObj);
    if (result.status === 200) getData();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab icon={<CameraEnhanceIcon />} label="Photos" {...a11yProps(0)} />
          <Tab icon={<FavoriteIcon />} label="Favorites" {...a11yProps(1)} />
          <Tab icon={<AssignmentIcon />} label="Requests" {...a11yProps(2)} />
          <Tab icon={<SettingsIcon />} label="Settings" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div>
            <Typography variant="h4" component="div">
              Your Photos:
            </Typography>
            <PhotoList
              images={userInfo.photos}
              handleDeleteClick={handleDeleteClick}
              handleEditClick={handleEditClick}
              handlePhotoClick={handlePhotoClick}
            />{" "}
            {changePhoto && (
              <EditModal
                open={open}
                handleClose={handleClose}
                changePhoto={changePhoto}
                setChangePhoto={setChangePhoto}
                newTag={newTag}
                setNewTag={setNewTag}
                handleEditSubmit={handleEditSubmit}
              />
            )}
          </div>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Box>
            <Typography variant="h4" component="h4">
              Your Favorites:
            </Typography>
            <VertGrid
              images={userInfo.favorites.filter((image) => !image.isDeleted)}
            />
          </Box>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Typography variant="h4" component="h4">
            Your Requests:
          </Typography>
          <UserRequestTable requests={userInfo.requests} />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={handleThemeChange}
                name="theme"
                color="primary"
              />
            }
            label={darkMode ? "Dark Mode" : "Light Mode"}
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={userInfo.isEmailShown}
                onChange={handleEmailChange}
                name="email"
                color="primary"
              />
            }
            label="Show Email on Profile"
          />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}

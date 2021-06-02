import React, { useContext, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
  Tooltip,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import AssignmentIcon from "@material-ui/icons/Assignment";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import BrightnessHighIcon from "@material-ui/icons/BrightnessHigh";
import { useHistory } from "react-router-dom";
import { logout, readNotifications } from "../../utils/API.js";
import { UserContext } from "../../contexts/UserContext";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    cursor: "pointer",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "90%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  reqBtn: {
    [theme.breakpoints.up("sm")]: {},
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function NavBar(props) {
  const { currentUser, changeUser } = useContext(UserContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [noteAnchorEl, setNoteAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const { darkMode, handleThemeChange } = props;
  const history = useHistory();
  const isMenuOpen = Boolean(anchorEl);
  const isNoteMenuOpen = Boolean(noteAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNoteAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleNotificationMenuClose = async () => {
    setNoteAnchorEl(null);
    handleMobileMenuClose();
    const notes = {
      notifications: currentUser.notifications,
    };
    await readNotifications(notes);
    changeUser({
      ...currentUser,
      notifications: [],
    });
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    changeUser({
      username: null,
      userId: null,
      isLoggedIn: false,
      isAdmin: false,
      notifications: null,
      favorites: null,
    });
    logout();
    handleMenuClose();
  };

  const handleProfileClick = () => {
    history.push(`/profile/${currentUser.userId}`);
    handleMenuClose();
  };

  const handleAccountClick = () => {
    history.push("/account");
    handleMenuClose();
  };

  const handleAdminClick = () => {
    history.push("/admin");
    handleMenuClose();
  };

  const handleLoginClick = () => {
    history.push("/login");
    handleMenuClose();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchQ = search;
    setSearch("");
    history.push(`/search?q=${searchQ}`);
  };

  const handleAddPhotoClick = (e) => {
    e.preventDefault();
    if (currentUser.username) history.push(`/newphoto`);
  };

  const handleTitleClick = () => {
    history.push("/");
    handleMenuClose();
  };

  const handleRequestClick = () => {
    history.push("/requests");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {currentUser.username ? (
        <div>
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleAccountClick}>My account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          {currentUser.isAdmin ? (
            <MenuItem onClick={handleAdminClick}>Admin Dash</MenuItem>
          ) : (
            ""
          )}
        </div>
      ) : (
        <MenuItem onClick={handleLoginClick}>Login</MenuItem>
      )}
    </Menu>
  );

  const noteMenuId = "notification-menu";
  const renderNotificationMenu = (
    <Menu
      anchorEl={noteAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={noteMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isNoteMenuOpen}
      onClose={handleNotificationMenuClose}
    >
      {currentUser.notifications
        ? currentUser.notifications.map((note) => (
            <MenuItem key={note._id} onClick={handleNotificationMenuClose}>
              {note.text}
            </MenuItem>
          ))
        : ""}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {currentUser.username ? (
        <div>
          <MenuItem onClick={handleTitleClick}>Home</MenuItem>
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleAccountClick}>My account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          {currentUser.isAdmin ? (
            <MenuItem onClick={handleAdminClick}>Admin Dash</MenuItem>
          ) : (
            ""
          )}
        </div>
      ) : (
        <MenuItem onClick={handleLoginClick}>Login</MenuItem>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            className={classes.title}
            variant="h6"
            noWrap
            onClick={handleTitleClick}
          >
            Snap-That <CameraEnhanceIcon />
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                value={search}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={handleSearchChange}
              />
            </div>
          </form>
          <div className={classes.grow} />
          {currentUser.username ? (
            <Tooltip title="Add Image">
              <IconButton onClick={handleAddPhotoClick}>
                <AddAPhotoIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
          <Tooltip title="Requests">
            <IconButton onClick={handleRequestClick}>
              <AssignmentIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={handleThemeChange}>
              {darkMode ? <BrightnessHighIcon /> : <Brightness3Icon />}
            </IconButton>
          </Tooltip>
          <div className={classes.sectionDesktop}>
            {currentUser.notifications && (
              <Tooltip title="Notifications">
                <IconButton
                  aria-label="show new notifications"
                  onClick={handleNotificationMenuOpen}
                >
                  <Badge
                    badgeContent={currentUser.notifications.length}
                    color="secondary"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={currentUser.username ? "Account/logout" : "Login"}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.sectionMobile}>
            <Tooltip title={currentUser.username ? "Account/logout" : "Login"}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
              >
                <MoreIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      {renderNotificationMenu}
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

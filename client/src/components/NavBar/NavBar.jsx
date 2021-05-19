import React, { useContext, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import { useHistory } from "react-router-dom";
import { logout, readNotifications } from "../../utils/API.js";
import { Link } from "react-router-dom";
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
    width: "100%",
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

export default function NavBar() {
  const { currentUser, changeUser } = useContext(UserContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [noteAnchorEl, setNoteAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
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
    });
    logout();
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
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem>
            <Link to="/account">My account</Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          {currentUser.isAdmin ? (
            <MenuItem>
              <Link to="/admin">Admin Dash</Link>
            </MenuItem>
          ) : (
            ""
          )}
        </div>
      ) : (
        <MenuItem>
          <Link to="/login">Login</Link>
        </MenuItem>
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
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem>
            <Link to="/account">My account</Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          {currentUser.isAdmin ? (
            <MenuItem>
              <Link to="/admin">Admin Dash</Link>
            </MenuItem>
          ) : (
            ""
          )}
        </div>
      ) : (
        <MenuItem>
          <Link to="/login">Login</Link>
        </MenuItem>
      )}
    </Menu>
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/search?q=${search}`);
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to="/">
              Snap-That <CameraEnhanceIcon />
            </Link>
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={handleSearchChange}
              />
            </div>
          </form>
          <Link to="/requests">Requests</Link>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {currentUser.notifications && (
              <IconButton
                aria-label="show new notifications"
                color="inherit"
                onClick={handleNotificationMenuOpen}
              >
                <Badge
                  badgeContent={currentUser.notifications.length}
                  color="secondary"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderNotificationMenu}
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

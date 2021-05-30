import "./App.css";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar/NavBar.jsx";
import { ThemeProvider } from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import NewPhotoPage from "./pages/NewPhotoPage.jsx";
import NewRequestPage from "./pages/NewRequestPage.jsx";
import RequestPage from "./pages/RequestPage.jsx";
import PhotoPage from "./pages/PhotoPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AdminDash from "./pages/AdminDash.jsx";
import { UserProvider } from "./contexts/UserContext";
import { lightTheme, darkTheme } from "./themes/themes";
import UseLocalStorage from "./hooks/useLocalStorage";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = UseLocalStorage("mode", "light");

  const handleThemeChange = (e) => {
    setDarkMode(!darkMode);
    if (mode === "light") setMode("dark");
    else setMode("light");
  };

  useEffect(() => {
    if (mode === "dark") setDarkMode(true);
  }, [mode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme() : lightTheme()}>
      <UserProvider>
        <CssBaseline />
        <BrowserRouter>
          <NavBar darkMode={darkMode} handleThemeChange={handleThemeChange} />
          <Switch>
            <Route exact path="/admin" component={AdminDash} />
            <Route exact path="/signup" component={SignupPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route
              exact
              path="/account"
              render={() => (
                <AccountPage
                  handleThemeChange={handleThemeChange}
                  darkMode={darkMode}
                />
              )}
            />
            <Route exact path="/search" component={SearchPage} />
            <Route exact path="/requests" component={RequestPage} />
            <Route exact path="/newphoto" component={NewPhotoPage} />
            <Route exact path="/newrequest" component={NewRequestPage} />
            <Route exact path="/photo/:id" component={PhotoPage} />
            <Route exact path="/profile/:id" component={ProfilePage} />
            <Route exact path="/" component={HomePage} />
          </Switch>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

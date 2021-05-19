import "./App.css";
import React from "react";
import NavBar from "./components/NavBar/NavBar.jsx";
import { ThemeProvider } from "@material-ui/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import NewPhotoPage from "./pages/NewPhotoPage.jsx";
import NewRequestPage from "./pages/NewRequestPage.jsx";
import RequestPage from "./pages/RequestPage.jsx";
import PhotoPage from "./pages/PhotoPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AdminDash from "./pages/AdminDash.jsx";
import { UserProvider } from "./contexts/UserContext";
import theme from "./themes/default";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <BrowserRouter>
          <NavBar />
          <Switch>
            <Route exact path="/admin" component={AdminDash} />
            <Route exact path="/signup" component={SignupPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/account" component={AccountPage} />
            <Route exact path="/search" component={SearchPage} />
            <Route exact path="/requests" component={RequestPage} />
            <Route exact path="/newphoto" component={NewPhotoPage} />
            <Route exact path="/newrequest" component={NewRequestPage} />
            <Route exact path="/photo/:id" component={PhotoPage} />
            <Route exact path="/" component={HomePage} />
          </Switch>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

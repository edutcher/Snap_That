import axios from "axios";

async function Login(user) {
  try {
    return await axios.post("/api/users/login", user);
  } catch (err) {
    return err;
  }
}

async function signUp(user) {
  try {
    return await axios.post("/api/users/new", user);
  } catch (err) {
    return err;
  }
}

async function uploadPhoto(photo) {
  try {
    return await axios.post("/api/photos/new", photo);
  } catch (err) {
    return err;
  }
}

async function isLoggedIn() {
  return await axios.get("/api/users/loggedin");
}

export { Login, signUp, uploadPhoto, isLoggedIn };

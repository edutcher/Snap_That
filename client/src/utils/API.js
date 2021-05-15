import axios from "axios";

async function login(user) {
  try {
    return await axios.post("/api/users/login", user);
  } catch (err) {
    return err;
  }
}

async function logout(user) {
  try {
    return await axios.get("/api/users/logout");
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

async function getPhotos() {
  return await axios.get("/api/photos");
}

async function isLoggedIn() {
  return await axios.get("/api/users/loggedin");
}

async function getUserInfo(id) {
  return await axios.get(`/api/users/${id}`);
}

async function postRequest(request) {
  return await axios.post(`/api/requests/new`, request);
}

async function approveRequest(request) {
  return await axios.post(`/api/requests/approve`, request);
}

async function fillRequest(request) {
  return await axios.post(`/api/requests/fill`, request);
}

async function completeRequest(request) {
  return await axios.post(`/api/requests/complete`, request);
}

async function getRequests() {
  return await axios.get(`/api/requests/active`);
}

async function getPendingRequests() {
  return await axios.get(`/api/requests/pending`);
}

export {
  login,
  logout,
  signUp,
  uploadPhoto,
  isLoggedIn,
  getUserInfo,
  postRequest,
  approveRequest,
  fillRequest,
  getRequests,
  getPendingRequests,
  completeRequest,
  getPhotos,
};

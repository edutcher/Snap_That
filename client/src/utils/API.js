import axios from "axios";

async function login(user) {
  return await axios.post("/api/users/login", user);
}

async function logout() {
  return await axios.get("/api/users/logout");
}

async function signUp(user) {
  return await axios.post("/api/users/new", user);
}

async function uploadPhoto(photo) {
  return await axios.post("/api/photos/new", photo);
}

async function uploadAvatar(photo) {
  return await axios.post("/api/photos/avatar", photo);
}

async function getPhotos() {
  return await axios.get("/api/photos");
}

async function getPhotoById(id) {
  return await axios.get(`/api/photos/${id}`);
}

async function isLoggedIn() {
  return await axios.get("/api/users/loggedin");
}

async function getUserInfo(id) {
  return await axios.get(`/api/users/${id}`);
}

async function getTopUsers() {
  return await axios.get(`/api/users/top`);
}

async function getTopPhotos() {
  return await axios.get(`/api/photos/top`);
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

async function denyRequest(request) {
  return await axios.post(`/api/requests/deny`, request);
}

async function deleteRequest(id) {
  return await axios.delete(`/api/requests/${id}`);
}

async function getRequests() {
  return await axios.get(`/api/requests/active`);
}

async function getRequestById(id) {
  return await axios.get(`/api/requests/${id}`);
}

async function getPendingRequests() {
  return await axios.get(`/api/requests/pending`);
}

async function getNotifications(id) {
  return await axios.get(`/api/notifications/user/${id}`);
}

async function readNotifications(notes) {
  return await axios.post(`/api/notifications/read`, notes);
}

async function searchPhotos(query) {
  return await axios.post(`/api/photos/search`, query);
}

async function getPhotosByCategory(category) {
  return await axios.get(`/api/photos/category/${category}`);
}

async function favoritePhoto(fav) {
  return await axios.post(`/api/photos/favorite`, fav);
}

async function deletePhoto(id) {
  return await axios.delete(`/api/photos/${id}`);
}

async function editPhoto(id, photo) {
  return await axios.put(`/api/photos/${id}`, photo);
}

async function getRandomPhoto() {
  return await axios.get(`/api/photos/random`);
}

async function changeEmailShown(id, isEmailShown) {
  return await axios.put(`/api/users/email/${id}`, isEmailShown);
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
  searchPhotos,
  getRequestById,
  denyRequest,
  getNotifications,
  readNotifications,
  getPhotoById,
  favoritePhoto,
  getPhotosByCategory,
  getRandomPhoto,
  deletePhoto,
  editPhoto,
  changeEmailShown,
  deleteRequest,
  getTopUsers,
  getTopPhotos,
  uploadAvatar,
};

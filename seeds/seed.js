let mongoose = require("mongoose");
let {
  User,
  Photo,
  Comment,
  Rating,
  Request,
  Notification,
} = require("../models");
require("dotenv").config();

mongoose.connect(process.env.MONGOD_URI || "mongodb://localhost/snapthat", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

let photoSeed = {
  image_url:
    "https://i.insider.com/5d239e0221a861411f3d50c6?width=1100&format=jpeg&auto=webp",
  title: "Mountain Lake",
  category: "Place",
  subcategory: "Nature",
  tags: ["Mountain", "Lake"],
};

let photoSeedTwo = {
  image_url:
    "https://cdn.cheapism.com/images/011618_most_beautiful_views_in_the_world_sli.max-420x243_80QjLcK.jpg",
  title: "Town Lake",
  category: "Place",
  subcategory: "Town",
  tags: ["Town", "Mountain", "Lake"],
};

let userSeed = {
  username: "Test",
  email: "Test@test.com",
};

const seedy = async () => {
  await User.deleteMany({});
  await Photo.deleteMany({});
  let newUser = new User(userSeed);

  await User.register(newUser, "test", function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
    }
  });

  let newPhotoSeed = {
    ...photoSeed,
    user: newUser._id,
  };

  let newPhotoSeedTwo = {
    ...photoSeedTwo,
    user: newUser._id,
  };

  let newPhoto = await Photo.create(newPhotoSeed);
  let newPhotoTwo = await Photo.create(newPhotoSeedTwo);

  newUser.photos.push(newPhoto);
  newUser.photos.push(newPhotoTwo);

  await newUser.save();

  console.log(newUser);
  console.log(newPhoto);
  console.log(newPhotoTwo);
};

seedy();

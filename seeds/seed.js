let mongoose = require("mongoose");
let { User, Photo, Request, Notification } = require("../models");
require("dotenv").config();

mongoose.connect(process.env.MONGOD_URI || "mongodb://localhost/snapthat", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

let photoSeed = {
  image_url:
    "https://res.cloudinary.com/dd9hrrpch/image/upload/v1622083446/w8nfgpq9xbkjzeihtgzd.jpg",
  title: "Aurora Borealis",
  category: "Items",
  dimensions: {
    height: 1620,
    width: 1080,
  },
  tags: ["Aurora", "Northern Lights"],
};

let photoSeedTwo = {
  image_url:
    "https://cdn.cheapism.com/images/011618_most_beautiful_views_in_the_world_sli.max-420x243_80QjLcK.jpg",
  title: "Town Lake",
  category: "Places",
  dimensions: {
    height: 420,
    width: 243,
  },
  tags: ["Town", "Mountain", "Lake"],
};

let userSeed = {
  username: "ThisWorldTraveled",
  email: "Test@test.com",
};

let userTwo = {
  username: "bobdole",
  email: "bob@dole.com",
};

let adminUser = {
  username: "Admin",
  email: "admin@admin.com",
  isAdmin: true,
};

let requestOne = {
  text: "Shoe on head",
};

let requestTwo = {
  text: "Dragon Temple",
};

const seedy = async () => {
  await User.deleteMany({});
  await Photo.deleteMany({});
  await Request.deleteMany({});
  await Notification.deleteMany({});

  let newUser = new User(userSeed);
  let newUserTwo = new User(userTwo);
  let newAdmin = new User(adminUser);

  await User.register(newUser, "test", function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
    }
  });

  await User.register(newUserTwo, "bobdole", function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
    }
  });

  await User.register(newAdmin, process.env.ADMIN_PW, function (err, user) {
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
    user: newUserTwo._id,
  };

  let newRequestOne = new Request({
    ...requestOne,
    user: newUser._id,
    status: "active",
  });

  let newRequestTwo = new Request({
    ...requestTwo,
    user: newUserTwo._id,
    status: "active",
  });

  let newPhoto = await Photo.create(newPhotoSeed);
  let newPhotoTwo = await Photo.create(newPhotoSeedTwo);

  newUser.photos.push(newPhoto._id);
  newUserTwo.photos.push(newPhotoTwo._id);

  newUser.requests.push(newRequestOne._id);
  newUserTwo.requests.push(newRequestTwo._id);

  //  await newUser.save();
  //  await newUserTwo.save();
  newRequestOne.save();
  newRequestTwo.save();

  console.log(newUser);
  console.log(newPhoto);
  console.log(newPhotoTwo);
  console.log(newRequestOne);
};

seedy();

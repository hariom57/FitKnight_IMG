const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadImages = require("./uploads/uploadImage");
const User = require("./models/User");
const UserData = require("./models/UserData");
const Post = require("./models/Posts");
const GroupData = require("./models/Group");

// Middlewares
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://milins2710:milinsocin32@socin.mmlzaer.mongodb.net/v1"
);

// Set up multer for file upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post(
  "/uploadprofilepic",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const imageFile = req.file;
      const imageUrls = await uploadImages([imageFile]);
      const imageUrl = imageUrls[0];
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json("User not found");
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { username, id: userDoc._id },
        "oierluhkt347rhye4jeikrhy8iwerh483ijrehtr84irjoqpz",
        {},
        (err, tokensocin) => {
          if (err) {
            console.error(err);
            return res.status(500).json("Failed to generate tokensocin");
          }
          res
            .cookie("tokensocin", tokensocin, {
              // httpOnly: true,
              // secure: true, // used in production ready projects as they have https but localhost runs on http
              // sameSite: "None", // Allow cross-origin cookies
            })
            .json({
              id: userDoc._id,
              username,
            });
        }
      );
    } else {
      res.status(400).json("Wrong credentials");
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

app.post(
  "/registerationpage",
  upload.single("profilePicture"),
  async (req, res) => {
    const {
      username,
      firstname,
      lastname,
      country,
      state,
      city,
      prefer,
      activity,
      time,
    } = req.body;
    const profilePictureUrl = req.file
      ? (await uploadImages([req.file]))[0]
      : "null";
    try {
      const finduser = await UserData.findOne({ username: username });
      if (finduser === null) {
        const userDoc = await UserData.create({
          username,
          pplink: profilePictureUrl,
          firstname,
          lastname,
          country,
          state,
          city,
          prefer,
          activity,
          time,
        });
        res.json(userDoc);
        console.log(userDoc);
      } else {
        const updater = await UserData.updateOne(
          { username: username },
          {
            $set: {
              firstname,
              lastname,
              country,
              state,
              city,
              prefer,
              activity,
              time,
              // pplink: profilePictureUrl,
            },
          }
        );
        res.json(updater);
      }
    } catch (e) {
      res.status(400).json(e.message);
    }
  }
);

app.post("/logout", (req, res) => {
  res.cookie("tokensocin", "").json("Logged out");
});

app.get("/profile", (req, res) => {
  const { tokensocin } = req.cookies;
  if (!tokensocin) {
    return res.status(401).json("No tokensocin provided");
  }

  jwt.verify(
    tokensocin,
    "oierluhkt347rhye4jeikrhy8iwerh483ijrehtr84irjoqpz",
    (err, info) => {
      if (err) {
        console.error("tokensocin verification error:", err);
        return res.status(401).json("Invalid tokensocin");
      }
      res.json(info);
    }
  );
});

app.post("/profilepage", (req, res) => {
  const { tokensocin } = req.cookies;

  if (!tokensocin) {
    return res.status(401).json("No tokensocin provided");
  }

  jwt.verify(
    tokensocin,
    "oierluhkt347rhye4jeikrhy8iwerh483ijrehtr84irjoqpz",
    async (err, info) => {
      if (err) {
        console.error("tokensocin verification error:", err);
        return res.status(401).json("Invalid tokensocin");
      }

      const username = info.username;

      try {
        const userDoc = await UserData.findOne({ username });
        if (!userDoc) {
          console.error("User not found for username:", username);
          return res.status(400).json("Complete the registration first");
        } else {
          res.json(userDoc);
        }
      } catch (e) {
        res.status(500).json("Registration error");
      }
    }
  );
});

app.post("/createpost", async (req, res) => {
  const { username, post } = req.body;
  // console.log("username: ", username)
  // console.log("post: ", post)

  if (!username || !post) {
    return res
      .status(400)
      .json({ message: "Username and post content are required." });
  }
  try {
    const postdata = await Post.create({ username, post });
    // console.log(postdata)
    res.json(postdata);

    // res.json({username, post})
  } catch (e) {
    console.error("Error creating post:", e);
    res.status(400).json({ message: e.message });
  }
});

app.post("/postsbyuser", async (req, res) => {
  const { tokensocin } = req.cookies;

  if (!tokensocin) {
    return res.status(401).json("No tokensocin provided");
  }

  jwt.verify(
    tokensocin,
    "oierluhkt347rhye4jeikrhy8iwerh483ijrehtr84irjoqpz",
    async (err, info) => {
      if (err) {
        console.error("tokensocin verification error:", err);
        return res.status(401).json("Invalid tokensocin");
      }

      const username = info.username;
      // console.log(username)

      try {
        const userDoc = await Post.find({ username: username });
        if (!userDoc) {
          console.error("User not found for username:", username);
          return res.status(400).json("Complete the registration first");
        } else {
          res.json(userDoc);
        }
      } catch (e) {
        res.status(500).json("Registration error");
      }
    }
  );
});

app.post("/postrec", async (req, res) => {
  const { tokensocin } = req.cookies;

  if (!tokensocin) {
    return res.status(401).json("No tokensocin provided");
  }

  jwt.verify(
    tokensocin,
    "oierluhkt347rhye4jeikrhy8iwerh483ijrehtr84irjoqpz",
    async (err, info) => {
      if (err) {
        console.error("tokensocin verification error:", err);
        return res.status(401).json("Invalid tokensocin");
      }
      const username = info.username;
      try {
        const userDoc = await Post.find({ username: { $ne: username } });
        if (!userDoc) {
          console.error("User not found for username:", username);
          return res.status(400).json("Complete the registration first");
        } else {
          res.json(userDoc);
        }
      } catch (e) {
        res.status(500).json("Registration error");
      }
    }
  );
});

app.post("/usernames", async (req, res) => {
  const { tokensocin } = req.cookies;

  if (!tokensocin) {
    return res.status(401).json("No tokensocin provided");
  }

  jwt.verify(
    tokensocin,
    "oierluhkt347rhye4jeikrhy8iwerh483ijrehtr84irjoqpz",
    async (err, info) => {
      if (err) {
        console.error("tokensocin verification error:", err);
        return res.status(401).json("Invalid tokensocin");
      }
      const username = info.username;
      try {
        const userDoc = await UserData.find({ username: { $ne: username } });
        const userdata = await UserData.find({ username: username });
        if (!userDoc) {
          console.error("User not found for username:", username);
          return res.status(400).json("Complete the registration first");
        } else {
          res.json({
            currentuser: userdata,
            userdata: userDoc,
          });
        }
      } catch (e) {
        res.status(500).json("Registration error");
      }
    }
  );
});

app.post("/sendreq", async (req, res) => {
  const { tokensocin } = req.cookies;
  const { sendto } = req.body;

  if (!tokensocin) {
    return res.status(401).json("No tokensocin provided");
  }

  jwt.verify(
    tokensocin,
    "oierluhkt347rhye4jeikrhy8iwerh483ijrehtr84irjoqpz",
    async (err, info) => {
      if (err) {
        console.error("tokensocin verification error:", err);
        return res.status(401).json("Invalid tokensocin");
      }

      const username = info.username;

      try {
        const userDoc = await UserData.findOne({ username: username });
        const sendtoDoc = await UserData.findOne({ username: sendto });

        // Check if both users exist
        if (!userDoc) {
          console.error("User not found for username:", username);
          return res.status(400).json("Complete the registration first");
        }
        if (!sendtoDoc) {
          console.error("User to send request to not found:", sendto);
          return res.status(404).json("User to send request to not found");
        }

        // Initialize arrays if they don't exist
        if (!userDoc.requestlist) {
          userDoc.requestlist = [];
        }
        if (!sendtoDoc.pendingreq) {
          sendtoDoc.pendingreq = [];
        }

        // Avoid duplicate entries in requestlist and pendingreq
        if (userDoc.requestlist.includes(sendto)) {
          return res
            .status(400)
            .json("You have already sent a request to this user");
        }
        if (sendtoDoc.pendingreq.includes(username)) {
          return res.status(400).json("This user has already requested you");
        }

        // Add the current user to the sendto user's pendingreq and vice versa
        userDoc.requestlist.push(sendto);
        sendtoDoc.pendingreq.push(username);

        // Save both documents
        await userDoc.save();
        await sendtoDoc.save();
        console.log("friend request sent");
        res.json({
          message: "Friend request sent successfully",
          userDoc,
        });
      } catch (e) {
        console.error("Error occurred while processing the request:", e);
        res.status(500).json("Server error while adding to the requestlist");
      }
    }
  );
});

app.post("/acceptrequest", async (req, res) => {
  const { tokensocin } = req.cookies;
  const { acceptto } = req.body;

  if (!tokensocin) {
    return res.status(401).json("No tokensocin provided");
  }

  jwt.verify(
    tokensocin,
    "oierluhkt347rhye4jeikrhy8iwerh483ijrehtr84irjoqpz",
    async (err, info) => {
      if (err) {
        console.error("tokensocin verification error:", err);
        return res.status(401).json("Invalid tokensocin");
      }

      const username = info.username;

      try {
        const userDoc = await UserData.findOne({ username: username });
        const accepttoDoc = await UserData.findOne({ username: acceptto });

        // Check if both users exist
        if (!userDoc) {
          console.error("User not found for username:", username);
          return res.status(400).json("Complete the registration first");
        }
        if (!accepttoDoc) {
          console.error("User to send request to not found:", acceptto);
          return res.status(404).json("User to send request to not found");
        }

        // Initialize arrays if they don't exist
        if (!userDoc.friends) {
          userDoc.friends = [];
        }
        if (!accepttoDoc.friends) {
          accepttoDoc.friends = [];
        }

        // Avoid duplicate entries in requestlist and pendingreq
        if (userDoc.friends.includes(acceptto)) {
          return res
            .status(400)
            .json("You have already sent a request to this user");
        }
        if (accepttoDoc.friends.includes(username)) {
          return res.status(400).json("This user has already requested you");
        }

        // Add the current user to the sendto user's pendingreq and vice versa
        userDoc.friends.push(acceptto);
        userDoc.pendingreq.splice(userDoc.requestlist.indexOf(acceptto), 1);
        accepttoDoc.friends.push(username);
        accepttoDoc.requestlist.splice(
          accepttoDoc.pendingreq.indexOf(username),
          1
        );

        // Save both documents
        await userDoc.save();
        await accepttoDoc.save();

        res.json({
          message: "Friend request accepted successfully",
          userDoc,
        });
      } catch (e) {
        console.error("Error occurred while processing the request:", e);
        res.status(500).json("Server error while adding to the requestlist");
      }
    }
  );
});

app.post("/creategroup", async (req, res) => {
  const { username, groupname } = req.body;
  try {
    const userDoc = await GroupData.create({
      admin: username,
      groupname,
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

app.post("/groups", async (req, res) => {
  try {
    const groupDoc = await GroupData.find({});
    res.json(groupDoc);
  } catch (e) {
    res.status(500).json("Registration error");
  }
});

app.post("/joingroup", async (req, res) => {
  const { groupid, username } = req.body;
  try {
    const groupDoc = await GroupData.findOne({ _id: groupid });
    console.log(groupDoc)
    groupDoc.members.push(username);
    await groupDoc.save();
    res.json(groupDoc);
  } catch (e) {
    res.status(500).json("Registration error");
  }
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});

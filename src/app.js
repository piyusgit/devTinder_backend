const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

/* The `app.use(express.json());` line in the code snippet is setting up middleware in Express to parse
incoming requests with JSON payloads. This middleware function parses incoming request bodies and
makes the parsed JSON data available on the `req.body` property of the request object. This is
commonly used to handle JSON data sent in POST requests, allowing you to access and work with the
JSON data in your Express routes. */
app.use(
  cors({
    origin: "https://your-frontend-url.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.sendStatus(200);
// });

const { authRouter } = require("./routes/authRoute");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
// Example of use of next function in express----

// app.use(
//   "/user",
//   (req, res, next) => {
//     // Route Handler

//     next();
//     console.log("Handling the user route");
//     // res.send("I Handle All User Requests");
//   },
//   (req, res) => {
//     console.log("Handling the user route 2");
//     res.send("I Handle All User Requests 2!");
//   }
// );

// app.use("/", (req, res) => {
//   res.send("Hello from express server!");
// });
// app.use("/test/2", (req, res) => {
//   res.send("Order of routes is important");
// });

// app.get("/user", (req, res) => {
//   res.send("Hello This is GET request");
// });

// app.post("/user", (req, res) => {
//   res.send("Hello This is POST request");
// });

// This will match all the HTTP methods APT Calls to /test
// app.use("/test", (req, res) => {
//   res.send("Hello from express server!");
// });

// app.use("/", (req, res) => {
//   res.send("Hello from express server!");
// });

// How Middleware Works---

/* app.use("/", (req, res, next) => {
  console.log("First Middleware");
  next();
});

app.get(
  "/user",
  (req, res, next) => {
    console.log("Hello This is GET request");
    next();
  },
  (req, res, next) => {
    res.send("Hello This is GET request");
  },
  (req, res) => {
    res.send("Hello This is GET request 2");
  }
); */

// Handle Auth Middleware for all GET,POST,... requests
/* app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("Hello from express server!");
});

app.get("/user", userAuth, (req, res) => {
  res.send("Hello from express server!");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Hello from express server, Deleting the user!");
}); */

// Feed Api for getting the all users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) return res.status(404).send("No users found");
    else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error in getting users: " + err.message);
  }
});

// Api for deleting the user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("No user found");
    } else {
      res.send("User Deleted Successfully");
    }
  } catch (err) {
    res.status(400).send("Error in deleting users: " + err.message);
  }
});

// Api for updating the user in the database
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  // const emailId = req.body.emailId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills can't be more than 10");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User data updated successfully");
  } catch (err) {
    res.status(400).send("Getting the in updating the user: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connection established...");
    app.listen(7777, () => {
      console.log("Listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Connection failed...", err);
  });

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://kumarpiyush2909:yCxlNXzEvQLWstyr@cluster3.7r9kv.mongodb.net/devTinder"
    // "mongodb+srv://<user1>:<Piyush2909>@cluster3.7r9kv.mongodb.net/"
  );
};

module.exports = connectDB;

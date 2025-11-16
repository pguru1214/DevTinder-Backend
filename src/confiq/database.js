const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://guruprasad0346:Vasavi%402024@firstdatabase.zefv2ti.mongodb.net/devTinder"
  );
};

module.exports = connectDB



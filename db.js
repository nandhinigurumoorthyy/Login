const mongoose = require("mongoose");

const mongoDBURI = "mongodb://localhost:27017/fsd2";

async function createDbConnection() {
  try {
    await mongoose.connect(mongoDBURI);
    console.log("connection established !!!---");
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  createDbConnection,
};

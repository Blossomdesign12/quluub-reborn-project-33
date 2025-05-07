
const mongoose = require("mongoose");

const connectDB = mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://johnkennedy3313:johnkennedy@cluster0.kqk80xr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error: ", err);
});

// Utility function to safely convert string or timestamp to ObjectId
const toObjectId = (id) => {
  try {
    if (typeof id === "string" && /^[a-f\d]{24}$/i.test(id)) {
      return new mongoose.Types.ObjectId(id); // valid ObjectId string
    } else if (typeof id === "number") {
      return mongoose.Types.ObjectId.createFromTime(id); // use timestamp
    } else {
      throw new Error("Invalid ObjectId input");
    }
  } catch (error) {
    console.error("Invalid ObjectId:", error);
    return id;
  }
};

module.exports = {
  mongoose,
  toObjectId
};

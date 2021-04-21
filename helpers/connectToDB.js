const mongoose = require("mongoose");
mongoose.connect(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("error", () => {
  console.log("Can't Connect To the DB");
});

mongoose.connection.once("open", () => {
  console.log("Connected to DB Succesfully ");
});

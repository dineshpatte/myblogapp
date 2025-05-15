import connectDb from "./db/index.js";

import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDb()
  .then(
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server is running at port : ${process.env.PORT}`);
    })
  )

  .catch((error) => {
    console.log("mongodb connection failed !!!");
  });

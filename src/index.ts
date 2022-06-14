import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import { json } from "body-parser";
import { infoRouter } from "./routes/info";
import dotenv from "dotenv";

const app = express();
app.use(json());

// Register routes
app.use(infoRouter);

// Load .env variables
dotenv.config();

mongoose
  .connect(process.env.MONGO_AUTH_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then((result) => console.log("Connected to database"))
  .catch((err) => console.log(err));

app.listen(3000, () => {
    console.log('server is listening on port 3000!')
});

// Better tear down
process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    // some other closing procedures go here
    process.exit(0);
});

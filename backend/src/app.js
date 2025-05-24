import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();


app.use(cors({
  origin: 'https://myblogapp-xr2t.vercel.app',
  credentials: true,
}));




app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//route imports
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.routes.js";
import newsRouter from "./routes/news.route.js";

app.use("/api/news", newsRouter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

export default app;

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const AuthRouter = require('./routes/AuthRoutes');
const userRouter = require("./routes/userRoutes");
const menuRouter = require("./routes/menuRoutes");
const foodItemRouter = require("./routes/foodItemRoute");
const foodVoteRouter = require("./routes/foodVoteRoutes");
const preparedFoodRouter = require("./routes/preparedFoodRoutes");
const feedbackRouter  = require("./routes/feedbackRoutes");
const feedbackAnalysis = require("./routes/feedbackAnalysisRoutes");
const port = process.env.PORT || 3000;

app.use(cors());

const logger = (req,res,next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}
app.use(logger);

app.use(express.json());

app.use("/auth",AuthRouter);
app.use("/users",userRouter);
app.use("/menu",menuRouter);
app.use("/food",foodItemRouter);
app.use("/vote",foodVoteRouter);
app.use("/prepared",preparedFoodRouter);
app.use("/feedback",feedbackRouter);
app.use("/analysis",feedbackAnalysis);

app.listen(port,() => {
    console.log(`Server started at port number : ${port}`);
})
const express = require('express');
const router = express.Router();
const { verifyToken} = require('../middleware/AuthMiddleWare');
const authorize = require("../middleware/Role");
const {getTodayFeedback,getFoodFeedback,addFeedback} = require("../controller/FeedbackController");

//STUDENT
router.post("/add",verifyToken,authorize('STUDENT'),addFeedback);

//CHEF
router.get("/today",verifyToken,authorize('CHEF'),getTodayFeedback);
//for specific food
router.get("/food/:food_id",verifyToken,authorize('CHEF'),getFoodFeedback);

module.exports = router;
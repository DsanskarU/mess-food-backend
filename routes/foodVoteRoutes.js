const express = require('express');
const router = express.Router();
const {voteFood,getTodayVoteResults, getMyTodayVotes} = require("../controller/FoodVoteController")
const { verifyToken} = require('../middleware/AuthMiddleWare');
const authorize = require("../middleware/Role");

//STUDENT
router.post("/add",verifyToken,authorize('STUDENT'),voteFood);

//CHEF SEE TODAYS VOTE
router.get("/result/today",verifyToken,authorize('CHEF'),getTodayVoteResults);

router.get("/my-votes", verifyToken, getMyTodayVotes);
module.exports = router;
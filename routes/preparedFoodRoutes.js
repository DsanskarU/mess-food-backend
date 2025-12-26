const express = require('express');
const router = express.Router();
const { verifyToken} = require('../middleware/AuthMiddleWare');
const authorize = require("../middleware/Role");
const{addPreparedFood,getTodayPreparedFood,undoPreparedFood} = require("../controller/PreparedFoodController");

//CHEF
router.post("/add",verifyToken,authorize('CHEF'),addPreparedFood);

//CHEF AND STUDENT
router.get('/today',verifyToken,getTodayPreparedFood);

//undo delete todays prepared food
router.delete("/:food_id", verifyToken,authorize('CHEF',),undoPreparedFood);
module.exports = router;
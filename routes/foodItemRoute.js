const express = require('express');
const router = express.Router();
const {addFoodItem,getAllFoodItems,getFoodItemsById,updateFoodItems,deleteFoodItem} = require('../controller/FoodItemController');

const { verifyToken} = require('../middleware/AuthMiddleWare');
const authorize = require("../middleware/Role");

//STUDENT + CHEF
router.get("/",verifyToken,getAllFoodItems);
router.get("/:id",verifyToken,getFoodItemsById);

//CHEF ONLY
router.post("/add",verifyToken,authorize('CHEF'),addFoodItem);
router.put("/update/:id",verifyToken,authorize('CHEF'),updateFoodItems);
router.delete("/delete/:id",verifyToken,authorize('CHEF'),deleteFoodItem);

module.exports = router;
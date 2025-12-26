const express = require('express');
const router = express.Router();
const {addMenu, getTodayMenu, getMenuByDate} = require("../controller/MenuController");
const{verifyToken} = require("../middleware/AuthMiddleWare");
const authorize = require("../middleware/Role");

router.post("/add",verifyToken,authorize(['CHEF']),addMenu);

router.get("/today",getTodayMenu);

router.get("/date/:date",getMenuByDate);

module.exports = router;
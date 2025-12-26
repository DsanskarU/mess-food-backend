const express = require("express");
const route = express.Router();
const {getAllUsers,getUserById,updateUser,deleteUser}= require('../controller/userController');
const {verifyToken} = require('../middleware/AuthMiddleWare');
const authorize = require("../middleware/Role");
route.get("/",verifyToken,authorize(['CHEF']), getAllUsers);
route.get("/:id",verifyToken,getUserById);
route.put("/update/:id",verifyToken,authorize(['CHEF']),updateUser);
route.delete("/:id",verifyToken,authorize(['CHEF']),deleteUser);


module.exports = route;
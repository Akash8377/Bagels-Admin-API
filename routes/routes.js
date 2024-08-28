const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const commonController = require("../controllers/common");
const userController = require("../controllers/user");
const blog = require("../controllers/blog");
const fileController = require("../controllers/file.controller");
const  weekController = require("../controllers/week")
const gridController = require("../controllers/grid")
const opponentController = require("../controllers/opponent")
const {
 blogUpValidataion,
  loginUpValidataion,
  weekValidataion,
  gridValidataion,
  opponentValidation,
 
} = require("../helper/validation");

router.post("/login", loginUpValidataion, userController.getUserLogin);
router.get("/welcome", auth.verifyToken, userController.welcome);
router.post("/logout", userController.logout);

router.get("/all/user-list", userController.get_all_user);

/* files upload/download Route */
router.post("/upload", fileController.upload);
router.get("/files", fileController.getListFiles);
router.get("/files/:name", fileController.download);
router.delete("/files/:name", fileController.remove);

//  Blog Route =================

router.post("/add-blog", blogUpValidataion, auth.verifyToken, blog.addblog);
router.get("/list-blog", auth.verifyToken, blog.getblog);
router.get("/edit-blog/:id", auth.verifyToken, blog.editblog);
router.put("/update-blog/:id", auth.verifyToken, blog.updateblog);
router.delete("/delete-blog/:id", auth.verifyToken, blog.deleteblog);
router.put("/status-blog/:id", auth.verifyToken, blog.status);

//===========week================

router.post("/add-week", weekValidataion, auth.verifyToken, weekController.register);
router.get("/list-week", auth.verifyToken, weekController.get);
router.get("/edit-week/:id", auth.verifyToken, weekController.edit);
router.put("/update-week/:id", weekValidataion, auth.verifyToken, weekController.update);
router.delete("/delete-week/:id", auth.verifyToken, weekController.delete);
router.put("/status-week/:id", auth.verifyToken, weekController.status);

// Grid Routes
router.post("/add-grid", gridValidataion, auth.verifyToken, gridController.register);
router.get("/list-grid", auth.verifyToken, gridController.get);
router.get("/edit-grid/:id", auth.verifyToken, gridController.edit);
router.put("/update-grid/:id", gridValidataion, auth.verifyToken, gridController.update);
router.delete("/delete-grid/:id", auth.verifyToken, gridController.delete);
router.put("/status-grid/:id", auth.verifyToken, gridController.status);

// Opponent Routes
router.post("/add-opponent", opponentValidation, auth.verifyToken, opponentController.register);
router.get("/list-opponent", auth.verifyToken, opponentController.get);
router.get("/edit-opponent/:id", auth.verifyToken, opponentController.edit);
router.put("/update-opponent/:id", opponentValidation, auth.verifyToken, opponentController.update);
router.delete("/delete-opponent/:id", auth.verifyToken, opponentController.delete);
router.put("/status-opponent/:id", auth.verifyToken, opponentController.status);

module.exports = router;

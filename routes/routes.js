const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const commonController = require("../controllers/common");
const userController = require("../controllers/user");
const blog = require("../controllers/blog");
const fileController = require("../controllers/file.controller");
const week = require("../controllers/week")
const grid = require("../controllers/grid")
const opponent = require("../controllers/opponent")
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


//  Week Route =================


router.post(
  "/add-week",
  weekValidataion,
  auth.verifyToken,
  week.register
);
router.get("/list-week", auth.verifyToken, week.get);
router.get("/edit-week/:id", auth.verifyToken, week.edit);
router.put(
  "/update-week/:id",
  weekValidataion,
  auth.verifyToken,
  week.update
);
router.delete("/delete-week/:id", auth.verifyToken, week.delete);
router.put("/status-week/:id", auth.verifyToken, week.status)

//-----opponent------------
router.post(
  "/add-opponent",
  opponentValidation,
  auth.verifyToken,
  opponent.register
);

router.get("/list-opponent", auth.verifyToken, opponent.get);
router.get("/edit-opponent/:id", auth.verifyToken, opponent.edit);
router.put(
  "/update-opponent/:id",
  opponentValidation,
  auth.verifyToken,
  opponent.update
);
router.delete("/delete-opponent/:id", auth.verifyToken, opponent.delete);
router.put("/status-opponent/:id", auth.verifyToken, opponent.status)
//  grid Route =================


router.post(
  "/add-grid",
  gridValidataion,
  auth.verifyToken,
  grid.register
);
router.get("/list-grid", auth.verifyToken, grid.get);
router.get("/edit-grid/:id", auth.verifyToken, grid.edit);
router.put(
  "/update-grid/:id",
  gridValidataion,
  auth.verifyToken,
  grid.update
);
router.delete("/delete-grid/:id", auth.verifyToken, grid.delete);
router.put("/status-grid/:id", auth.verifyToken, grid.status)



module.exports = router; // export to use in server.js

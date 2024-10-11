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
const pick = require("../controllers/wadepick");
const top = require("../controllers/top");
const article = require("../controllers/article");
const gameController = require("../controllers/game");
const bet = require("../controllers/waderecord");
const recap = require("../controllers/adamrecap")
const live = require("../controllers/adamlive");
const future = require("../controllers/adamfuture");
const slip = require("../controllers/adamslip");
const userEmail = require("../controllers/userEmail");
const totalWin = require("../controllers/totalwin");
const contactUs = require("../controllers/contactUs");
const podcast = require("../controllers/podcast");
const promocodes = require("../controllers/promocodes")
// const sendMessage = require("../controllers/sendMessage")
const userPayments = require('../controllers/paymentDetails');
const { createPaymentIntent } = require("../controllers/paymentController");
const {
 blogUpValidataion,
  loginUpValidataion,
  weekValidataion,
  gridValidataion,
  opponentValidation,
  gameValidation,
  pickValidataion,
  topValidataion,
  articleValidataion,
  betValidataion,
  liveValidataion,
  futureValidataion,
  slipValidataion,
  recapValidataion
 
} = require("../helper/validation");


router.post("/login", loginUpValidataion, userController.getUserLogin);
router.get("/welcome", auth.verifyToken, userController.welcome);
router.post("/logout", userController.logout);

router.get("/all/user-list", userController.get_all_user);
// router.delete("delete/user-list/:id", auth.verifyToken, userController.deleteUserData);

//Send bulkSMS
// router.post("/send-bulksms", sendMessage.sendBulkSMS)
// router.get("/get-sms", sendMessage.fetchMessages)
// router.delete("/delete-sms/:id", sendMessage.deleteMessage)

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

// Game Routes
router.post("/add-game", gameValidation, auth.verifyToken, gameController.register);
router.get("/list-game", auth.verifyToken, gameController.get);
router.get("/edit-game/:id", auth.verifyToken, gameController.edit);
router.put("/update-game/:id", gameValidation, auth.verifyToken, gameController.update);
router.delete("/delete-game/:id", auth.verifyToken, gameController.delete);
router.put("/status-game/:id", auth.verifyToken, gameController.status);



//picks-----------------------------
router.post(
  "/add-pick",
  pickValidataion,
  auth.verifyToken,
  pick.register
);
router.get("/list-pick", auth.verifyToken, pick.get);
router.get("/edit-pick/:id", auth.verifyToken, pick.edit);
router.put(
  "/update-pick/:id",
  pickValidataion,
  auth.verifyToken,
  pick.update
);
router.delete("/delete-pick/:id", auth.verifyToken, pick.delete);
router.put("/status-pick/:id", auth.verifyToken, pick.status);

//article------------

router.post(
  "/add-top",
  topValidataion,
  auth.verifyToken,
  top.register
);
router.get("/list-top", auth.verifyToken, top.get);
router.get("/edit-top/:id", auth.verifyToken, top.edit);
router.put(
  "/update-top/:id",
  topValidataion,
  auth.verifyToken,
  top.update
);
router.delete("/delete-top/:id", auth.verifyToken, top.delete);
router.put("/status-top/:id", auth.verifyToken, top.status);


//article------------------------
router.post(
  "/add-article",
  articleValidataion,
  auth.verifyToken,
  article.register
);
router.get("/list-article", auth.verifyToken, article.get);
router.get("/edit-article/:id", auth.verifyToken, article.edit);
router.put(
  "/update-article/:id",
  articleValidataion,
  auth.verifyToken,
  article.update
);
router.delete("/delete-article/:id", auth.verifyToken, article.delete);
router.put("/status-article/:id", auth.verifyToken, article.status);

//live------------------------
router.post(
  "/add-live",
  liveValidataion,
  auth.verifyToken,
  live.register
);
router.get("/list-live", auth.verifyToken, live.get);
router.get("/edit-live/:id", auth.verifyToken, live.edit);
router.put(
  "/update-live/:id",
  liveValidataion,
  auth.verifyToken,
  live.update
);
router.delete("/delete-live/:id", auth.verifyToken, live.delete);
router.put("/status-live/:id", auth.verifyToken, live.status);

//future------------------------
router.post(
  "/add-future",
  futureValidataion,
  auth.verifyToken,
  future.register
);
router.get("/list-future", auth.verifyToken, future.get);
router.get("/edit-future/:id", auth.verifyToken, future.edit);
router.put(
  "/update-future/:id",
  futureValidataion,
  auth.verifyToken,
  future.update
);
router.delete("/delete-future/:id", auth.verifyToken, future.delete);
router.put("/status-future/:id", auth.verifyToken, future.status);

//slip------------------------
router.post(
  "/add-slip",
  slipValidataion,
  auth.verifyToken,
  slip.register
);
router.get("/list-slip", auth.verifyToken, slip.get);
router.get("/edit-slip/:id", auth.verifyToken, slip.edit);
router.put(
  "/update-slip/:id",
  slipValidataion,
  auth.verifyToken,
  slip.update
);
router.delete("/delete-slip/:id", auth.verifyToken, slip.delete);
router.put("/status-slip/:id", auth.verifyToken, slip.status);

//bet------------------------
router.post(
  "/add-bet",
  betValidataion,
  auth.verifyToken,
  bet.register
);
router.get("/list-bet", auth.verifyToken, bet.get);
router.get("/edit-bet/:id", auth.verifyToken, bet.edit);
router.put(
  "/update-bet/:id",
  betValidataion,
  auth.verifyToken,
  bet.update
);
router.delete("/delete-bet/:id", auth.verifyToken, bet.delete);
router.put("/status-bet/:id", auth.verifyToken, bet.status);


//recap------------------------
router.post(
  "/add-recap",
  recapValidataion,
  auth.verifyToken,
  recap.register
);
router.get("/list-recap", auth.verifyToken, recap.get);
router.get("/edit-recap/:id", auth.verifyToken, recap.edit);
router.put(
  "/update-recap/:id",
  recapValidataion,
  auth.verifyToken,
  recap.update
);
router.delete("/delete-recap/:id", auth.verifyToken, recap.delete);
router.put("/status-recap/:id", auth.verifyToken, recap.status);

//userEmail -
router.get("/list-user-email", auth.verifyToken, userEmail.get);
router.delete("/delete-user-email/:id", auth.verifyToken, userEmail.delete);

//userPayment Details -

router.get("/list-payments-details", auth.verifyToken, userPayments.get)

//total win and loss-------------

//recap------------------------
router.post(
  "/add-win",
  auth.verifyToken,
  totalWin.register
);
router.get("/list-win", auth.verifyToken, totalWin.get);
router.get("/edit-win/:id", auth.verifyToken, totalWin.edit);
router.put(
  "/update-win/:id",
  auth.verifyToken,
  totalWin.update
);
//contact-us---------

router.get("/list-contact", auth.verifyToken, contactUs.get);
router.get("/edit-contact/:id",  contactUs.edit);

router.delete("/delete-contact/:id",  contactUs.delete);


//podcast------------------------
router.post(
  "/add-podcast",
  auth.verifyToken,
  podcast.register
);
router.get("/list-podcast", auth.verifyToken, podcast.get);
router.get("/edit-podcast/:id", auth.verifyToken, podcast.edit);
router.put(
  "/update-podcast/:id",
  auth.verifyToken,
  podcast.update
);
router.delete("/delete-podcast/:id", podcast.delete);
router.put("/status-podcast/:id", auth.verifyToken, podcast.status);

router.post("/add-promocode",promocodes.create);
router.get("/list-promocode", auth.verifyToken, promocodes.get);
router.get("/edit-promocode/:id", auth.verifyToken, promocodes.edit);
router.put("/update-promocode/:id", auth.verifyToken, promocodes.update);
router.delete("/delete-promocode/:id", promocodes.delete);
router.put("/status-promocode/:id", auth.verifyToken, promocodes.status);


module.exports = router;

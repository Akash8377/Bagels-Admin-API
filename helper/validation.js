const { check } = require("express-validator");

exports.agentssignUpValidataion = [
  check("first_name", "First Name is required").not().isEmpty(),
  // check('last_name','Last Name is required').not().isEmpty(),
  check("country", "Country is required").not().isEmpty(),
  check("state", "State is required").not().isEmpty(),
  check("city", "City is required").not().isEmpty(),
  check("zip", "Zip is required").not().isEmpty(),
  check("address", "Address is required").not().isEmpty(),
  check("phoneno", "Phone no is required").not().isEmpty(),
  check("email", "Email is required").isEmail(),
  check("password", "Password is required").isLength({ min: 5 }),
];

exports.agentsupdateValidataion = [
  check("first_name", "First Name is required").not().isEmpty(),
  // check('last_name','Last Name is required').not().isEmpty(),
  check("country", "Country is required").not().isEmpty(),
  check("state", "State is required").not().isEmpty(),
  check("city", "City is required").not().isEmpty(),
  check("zip", "Zip is required").not().isEmpty(),
  check("address", "Address is required").not().isEmpty(),
  check("phoneno", "Phone no is required").not().isEmpty(),
  check("email", "Email is required").isEmail(),
  //check('password','Password is required').isLength({ min: 5 }),
];

exports.loginUpValidataion = [
  check("email", "Email is required")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is required").not().isEmpty(),
];

exports.blogUpValidataion = [
  check("name", "Name is required").not().isEmpty(),
  //check('image','Password is required').not().isEmpty(),
];
exports.privacyUpValidataion = [
  check("name", "Name is required").not().isEmpty(),
  //check('image','Password is required').not().isEmpty(),
];
exports.disclamerUpValidataion = [
  check("name", "Name is required").not().isEmpty(),
  //check('image','Password is required').not().isEmpty(),
];
exports.cancellationUpValidataion = [
  check("name", "Name is required").not().isEmpty(),
  //check('image','Password is required').not().isEmpty(),
];

exports.testimonialValidataion = [
  check("name", "Name is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("rating", "Rating is required").not().isEmpty(),
  check("country", "Country is required").not().isEmpty(),
];

exports.weekValidataion = [
  check("week_name", "Week Name is required").not().isEmpty(),
];

exports.gridValidataion = [
  check("expected_value", "Expected Value is required").not().isEmpty(),
  check("win_percentage", "Win Percentage is required").not().isEmpty(),
  check("major_percentage", "Major Percentage is required").not().isEmpty(),
  check("team", "Team Name is required").not().isEmpty(),
  check("future", "Future is required").not().isEmpty(),
];

exports.opponentValidation = [
  check("opponent_name", "Opponent name is required").not().isEmpty(),
];
exports.gameValidation = [
  check("game_name", "Game name is required").not().isEmpty(),
];
exports.topValidataion = [
  check("home_team", "home team is required").not().isEmpty(),
  check("away_team", "away team is required").not().isEmpty(),
  //check('image','Image is required').not().isEmpty(),
];
exports.pickValidataion= [
  check("home_team", "home team is required").not().isEmpty(),
  check("away_team", "away team is required").not().isEmpty(),
  //check('image','Image is required').not().isEmpty(),
];
exports.articleValidataion= [
  check("heading", "header is required").not().isEmpty(),
  check("paragraph", "description is required").not().isEmpty(),
  //check('image','Image is required').not().isEmpty(),
];
exports.liveValidataion = [
  check("team", "Team is required").not().isEmpty(),
  check("player_name", "player name is required").not().isEmpty(),
  check("spread", "player name is required").not().isEmpty(),
  //check('image','Image is required').not().isEmpty(),
];
exports.futureValidataion = [
  check("team", "Team is required").not().isEmpty(),
  check("player_name", "player name is required").not().isEmpty(),
  check("spread", "player name is required").not().isEmpty(),
  //check('image','Image is required').not().isEmpty(),
];
exports.slipValidataion= [
  check("image", "Image Slip is required").not().isEmpty()
  //check('image','Image is required').not().isEmpty(),
];
exports.recapValidataion= [
  check("video", "Video Recap is required").not().isEmpty()
  //check('image','Image is required').not().isEmpty(),
];
exports.betValidataion = [
  check("team", "Team is required").not().isEmpty(),
  check("player_name", "player name is required").not().isEmpty(),
  check("spread", "player name is required").not().isEmpty(),
  //check('image','Image is required').not().isEmpty(),
];


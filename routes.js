"use strict";

const express = require("express");
const router = express.Router();

const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const accounts = require("./controllers/accounts.js");
const trainer = require("./controllers/trainer");

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);
router.get("/dashboard", dashboard.index);
router.get("/dashboard/deleteassessment/:id", dashboard.deleteAssessment);
router.get("/about", about.index);
router.get("/trainerabout", about.trainerabout);
router.post("/dashboard/addassessment", dashboard.addAssessment);
router.get("/trainerdashboard", trainer.index);
router.get("/trainerdashboard/:id/trainermemberview", trainer.trainerMemberView)
router.get("/trainerdashboard/deletemember/:id", trainer.deleteMember)
router.get("/editmember", dashboard.edit);
router.post("/dashboard/editmember", dashboard.editMember);
router.post("/trainermemberview/:id/comment/:assessmentid", trainer.comment);

module.exports = router;

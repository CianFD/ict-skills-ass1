"use strict";

const memberstore = require("../models/member-store");
const trainerstore = require("../models/trainer-store");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Welcome to Fake Gym"
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to our Fake Gym"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("member", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Sign Up to our FAKE GYM"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const member = request.body;
    member.id = uuid.v1();
    memberstore.addMember(member);
    logger.info(`registering ${member.email}`);
    response.redirect("/");
  },

  authenticate(request, response) {
    const member = memberstore.getMemberByEmail(request.body.email);
    const trainer = trainerstore.getTrainerByEmail(request.body.email);
    if (member && memberstore.memberCheckPassword(request.body.password)) {
      response.cookie("member", member.email);
      logger.info(`logging in ${member.email}`);
      response.redirect("/dashboard");
    }
    else if (trainer && trainerstore.trainerCheckPassword(request.body.password)) {
      response.cookie("trainer", trainer.email);
      logger.info(`logging in ${trainer.email}`);
      response.redirect("/trainerdashboard");
    }
    else {
      response.redirect("/login");
    }
  },


  getCurrentMember(request) {
    const memberEmail = request.cookies.member;
    return memberstore.getMemberByEmail(memberEmail);
  },
  
  getCurrentTrainer(request) {
    const trainerEmail = request.cookies.trainer;
    return trainerstore.getTrainerByEmail(trainerEmail);
  }
};

module.exports = accounts;
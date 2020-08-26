"use strict";

const memberstore = require("../models/member-store");
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
    if (member) {
      response.cookie("playlist", member.email);
      logger.info(`logging in ${member.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  getCurrentMember(request) {
    const memberEmail = request.cookies.playlist;
    return memberstore.getMemberByEmail(memberEmail);
  }
};

module.exports = accounts;
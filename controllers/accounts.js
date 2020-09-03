"use strict"; //expression which enables javascript strict mode on the controller

const memberstore = require("../models/member-store"); //variable calling commands from the member-store model
const trainerstore = require("../models/trainer-store"); //variable calling commands from the trainer-store model
const logger = require("../utils/logger"); //variable calling commands from the logger util
const uuid = require("uuid"); //variable calling the pre-built system for Javascript to create Universally Unique IDentifiers

const accounts = {
  //creates accounts variable
  index(request, response) {
    /*creates index command which takes in a request loading the webpage
                              and then responds by opening the welcome page*/
    const viewData = { //creates viewData variable inside the index command
      title: "Welcome to Fake Gym" //adds website tab title "Welcome to Fake Gym"
    };
    response.render("index", viewData); //responds to website load request by rendering the gym welcome page
  },

  login(request, response) { /*creates login command which takes in request by
                              clicking login button in welcome menu and then responds by opening the login page*/
    const viewData = { //creates viewData variable inside the login command
      title: "Login to our Fake Gym" //adds website tab title "Login to our Fake Gym"
    };
    response.render("login", viewData); //responds to login button request by rendering the login page
  },

  logout(request, response) { /*creates logout command which takes in request by clicking logout button in menu
                              and then responds by loading the gym welcome page*/
    response.cookie("member", ""); //
    response.redirect("/"); //responds to logout button press by redirecting to welcome page
  },

  signup(request, response) { /*creates signup command which takes in request by clicking on signup menu button
                              and responds by opening the signup form page*/
    const viewData = { //creates viewData variable inside the signup command
      title: "Sign Up to our FAKE GYM" //adds website tab title "Sign Up to our FAKE GYM"
    };
    response.render("signup", viewData); //responds to signup button press by redirecting to signup form page
  },

  register(request, response) {
    const member = request.body;
    member.id = uuid.v1();
    const numAssessments = 0;
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
    } else if (trainer && trainerstore.trainerCheckPassword(request.body.password)) {
      response.cookie("trainer", trainer.email);
      logger.info(`logging in ${trainer.email}`);
      response.redirect("/trainerdashboard");
    } else {
      response.redirect("/login");
    }
  },

  getCurrentMember(request) {
    const memberEmail = request.cookies.member;
    return memberstore.getMemberByEmail(memberEmail);
  },

  getCurrentTrainer(request) { //command which takes in a request to get the current trainer who is logged in
    const trainerEmail = request.cookies.trainer;
    return trainerstore.getTrainerByEmail(trainerEmail);
  }
};

module.exports = accounts; //this controller exports the full content of the accounts const

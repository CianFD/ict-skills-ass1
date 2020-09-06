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

  register(request, response) { /*creates register command which takes in request by clicking on register button button
                              and responds by adding a new member with details then redirecting to welcome page*/
    const member = request.body; //creates member variable which equals the details entered in the sign-up form
    member.id = uuid.v1(); //variable id of member is set using uuid controller
    const numAssessments = 0; //variable numAssessments is set for all new Members at 0
    memberstore.addMember(member); //addMember command from memberstore.js is called adding new Member with details entered in Sign-Up Form.
    logger.info(`registering ${member.email}`); //log entered in logger detailing that member has been registered
    response.redirect("/"); //website redirects to welcome page.
  },

  authenticate(request, response) { /*creates authenticate command which takes in request by clicking on login button button
                              and responds by either logging in a member or trainer and opening their relevant
                              dashboard or otherwise reloading the login page*/
    const member = memberstore.getMemberByEmail(request.body.email); /*member is set using the getMemberByEmail command from
                                                                      memberstore taking in the email address entered in the
                                                                      log in form*/
    const trainer = trainerstore.getTrainerByEmail(request.body.email); /*member is set using the getTrainerByEmail command from
                                                                      trainerstore taking in the email address entered in the
                                                                      log in form*/
    if (member && memberstore.memberCheckPassword(request.body.password)) { /*if statement taking in value of member entered in email
                                                                            window and value of password entered in password window
                                                                            are equal to the details of the member in the member-store.json*/
      response.cookie("member", member.email); //takes in the cookie of the logging in member
      logger.info(`logging in ${member.email}`); //adds log statement saying logging in member with the member's e-mail
      response.redirect("/dashboard"); //opens the members dashboard displaying the logged in members details
    } else if (trainer && trainerstore.trainerCheckPassword(request.body.password)) { /*if statement taking in value of trainer entered in email
                                                                            window and value of password entered in password window
                                                                            are equal to the details of the trainer in the trainer-store.json*/
      response.cookie("trainer", trainer.email); //takes in the cookie of the logging in trainer
      logger.info(`logging in ${trainer.email}`); //adds log statement saying logging in trainer with the trainer's e-mail
      response.redirect("/trainerdashboard"); //opens the trainers dashboard displaying the logged in trainers details
    } else {
      response.redirect("/login"); /*if neither of the above if statements are successful because the member or
                                    trainer log-in details are entered incorrectly login view is refreshed*/
    }
  },

  getCurrentMember(request) { //command which takes in a request to get the current member who is logged in
    const memberEmail = request.cookies.member; //sets const memberEmail as the cookies when logging in a member
    return memberstore.getMemberByEmail(memberEmail); /*returns the result of getMemberByEmail command from the
                                                          memberstore model taking in the memberEmail const*/
  },

  getCurrentTrainer(request) { //command which takes in a request to get the current trainer who is logged in
    const trainerEmail = request.cookies.trainer; //sets const trainerEmail as the cookies when logging in a trainer
    return trainerstore.getTrainerByEmail(trainerEmail); /*returns the result of getTrainerByEmail command from the
                                                          trainerstore model taking in the trainerEmail const*/
  }
};

module.exports = accounts; //this controller exports the full content of the accounts const

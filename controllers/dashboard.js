"use strict"; //expression which enables javascript strict mode on the controller

const accounts = require("./accounts.js"); //variable calling the commands from the accounts controller
const logger = require("../utils/logger"); //variable calling commands from the logger util.
const assessmentStore = require("../models/assessment-store.js"); //variable calling commands from the assessment-store model
const memberStore = require("../models/member-store.js"); //variable calling commands from the member-store model
const uuid = require("uuid"); //variable calling the pre-built system for Javascript to create Universally Unique IDentifiers
const gymUtility = require("../utils/gymutility.js"); //variable calling commands from teh gymutility util

const dashboard = { //creates dashboard variable
  index(request, response) { /*creates index command which takes in a request loading the member's dashboard from the log-in window
                              and then responds by opening the member's dashboard with their assessments and analytics*/
    logger.info("dashboard rendering"); //adds log stating dashboard is rendering
    const loggedInMember = accounts.getCurrentMember(request); /*creates variable loggedInMember which takes getCurrentMember
                                                                command from accounts controller taking in the member who has logged in
                                                                on the previous page*/
    const viewData = { //creates viewData variable inside the index command
      title: "Member Dashboard", //adds a title to the website tab displaying as "Member Dashboard"
      member: memberStore.getMemberById(loggedInMember.id), /*details displayed pertaining to member, e.g. Name, are found by taking
                                                            the id of the LoggedInMember variable above and using it in the getMemberById
                                                            command in the member-store model*/
      assessments: assessmentStore.getMemberAssessments(loggedInMember.id).reverse(), /*details displayed pertaining to the member's assessments
                                                                                      are found by taking the id of the LoggedInMember variable
                                                                                      above and using it in the getMemberAssessments command
                                                                                      in the assessment-store model. .reverse() is added at the end
                                                                                      assessments are displayed in reverse chronological order.*/
      bmi: gymUtility.bmi(loggedInMember.id), //details of loggedInMember is taken into bmi command of gymutility and member's current bmi is displayed.
      bmiCat: gymUtility.bmiCat(loggedInMember.id), //details of loggedInMember is taken into bmiCat command of gymutility and member's current bmiCat is displayed.
      isIdealWeight: gymUtility.isIdealWeight(loggedInMember.id) /*details of loggedInMember is taken into isIdealWeight command of gymutility and if member's
                                                                  weight is in ideal range or not is displayed*/
    };
    logger.info("about to render ${memberid}"); //adds log
    response.render("dashboard", viewData); //renders dashboard view with content of viewData for logged in Member
  },

  deleteAssessment(request, response) { /*creates deleteAssessment command which takes in a request by clicking on trash icon
                                        next to an assessment and responding by deleting the assessment*/
    const loggedInMember = accounts.getCurrentMember(request); /*creates loggedInMember variable which takes in the request
                                                                and uses getCurrentMember method from accounts controller
                                                                to determine which member's assessments to work with*/
    const assessmentId = request.params.id; //creates assessmentId variable which uses above request to determine id of assessment being worked on
    logger.debug(`Deleting Assessment ${assessmentId}`); //adds log stating deleting assessment with id
    assessmentStore.removeAssessment(assessmentId); /*uses removeAssessment method from assessment-store model which takes in the
                                                      assessmentId from above and deletes the corresponding assessment*/
    response.redirect("/dashboard"); //once assessment is deleted page redirects back to the dashboard
  },

  addAssessment(request, response) { /*creates addAssessment command which takes in a request by entering assessment details
                                      then clicking on Add Assessment button and responding by adding the assessment to the assesment-store.json*/
    const loggedInMember = accounts.getCurrentMember(request); /*creates loggedInMember variable which takes in the request
                                                                and uses getCurrentMember method from accounts controller
                                                                to determine which member's assessments to work with*/
    const newAssessment = { //creates variable newAssessment which takes in the below details
      id: uuid.v1(), //id of the assessment is set using the uuid controller
      memberId: loggedInMember.id, //memberId of new assessment is set as the id of the logged in Member
      dateAndTime: new Date().toUTCString(), //date and time of the new assessment is set as the current date and time at time of adding the assessment
      weight: Number(request.body.weight), //weight is taken in as the number value entered in the weight box of Add Assessment form
      chest: Number(request.body.chest), //chest is taken in as the number value entered in the chest box of Add Assessment form
      thigh: Number(request.body.thigh), //thigh is taken in as the number value entered in the thigh box of Add Assessment form
      upperArm: Number(request.body.upperArm), //upperArm is taken in as the number value entered in the upperArm box of Add Assessment form
      waist: Number(request.body.waist), //waist is taken in as the number value entered in the waist box of Add Assessment form
      hips: Number(request.body.hips), //hips is taken in as the number value entered in the hips box of Add Assessment form
      trend: gymUtility.trend /*trend takes in the trend command from gymutility util comparing the value of the weight being added
                              in the new assessment and the value of the most recent previous assessment. If the weight is lower in the new Assessment
                              trend is taken as true and displays as green, if weight is higher trend is taken as false and displays as red.*/
    };
    logger.debug("Adding a new Assessment", newAssessment); //adds log
    assessmentStore.addAssessment(newAssessment); /*adds values of new assessment above into the addAssessment command in assessment-store model
                                                  adding the assessment to the assessment-store.json*/
    response.redirect("/dashboard"); //once the assessment is added the dashboard is displayed again with the new assessment included
  },

  edit(request, response) { //takes in request by clicking on edit member button in menu and responding by opening edit member view
    logger.debug("rendering edit member form"); //adds log stating rendering edit member form
    response.render("editmember"); //responds by opening editmember view
  },

  editMember(request, response) { /*creates editMember command which takes in a request by entering the member's new details
                                      then clicking on Submit button and responding by adding the member's editted details to the member-store.json*/
    const memberId = request.params.id; //sets variable memberId as the id of the currently logged in Member
    const member = accounts.getCurrentMember(request); //sets variable member by adding details of currently logged in Member to the getCurrentMember command in accounts controller
    const updatedMember = { //creates variable updatedMember which takes in the blow details
      name: request.body.name, //updated name is taken in as the string entered in name field
      email: request.body.email, //updated email is taken in as the string entered in email field
      address: request.body.address, //updated address is taken in as the string entered in address field
      gender: request.body.gender, //updated gender is taken in as the string entered in gender field
      password: request.body.password, //updated password is taken in as the string entered in password field
      height: request.body.height, //updated height is taken in as the string entered in height field
      startingWeight: request.body.startingWeight //updated startingWeight is taken in as the string entered in startingWeight field
    };
    logger.debug(`Updating Member`); //adds log stating updating the Member
    memberStore.editMember(member, updatedMember); /*uses values of member and updatedMember and passes them into the editMember command of memberStore
                                                    changing the details of the member with the new details*/
    response.redirect("/dashboard"); //once the member details have been editted the page redirects to the dashboard with the updated member's details used.
  }
};

module.exports = dashboard; //this controller exports the full content of the dashboard const

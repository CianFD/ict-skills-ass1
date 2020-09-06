"use strict"; //expression which enables javascript strict mode on the controller

const accounts = require("./accounts.js"); //variable calling commands from the accounts controller
const logger = require("../utils/logger"); //variable calling commands from the logger util
const gymUtility = require("../utils/gymutility"); //variable calling commands from the gymutility util
const assessmentStore = require("../models/assessment-store.js"); //variable calling commands from the assessment-store model
const memberStore = require("../models/member-store.js"); //variable calling commands from the member-store model
const trainerStore = require("../models/trainer-store.js"); //variable calling commands from the trainer-store model
const uuid = require("uuid"); //variable calling the pre-built system for Javascript to create Universally Unique IDentifiers

const trainerdashboard = { //creates trainerdashboard variable
  index(request, response) { /*creates index command which takes in a request loading the trainer's dashboard from the log-in window
                              and then responds by opening the trainer's dashboard listing the names, number of assessments and an option to delete each member*/
    logger.info("trainer dashboard rendering"); //adds log showing trainer dashboard is opening
    const loggedInTrainer = accounts.getCurrentTrainer(request); /*creates variable loggedInTrainer which takes getCurrentTrainer
                                                                command from accounts controller taking in the trainer who has logged in
                                                                on the previous page*/
    for (const m of memberStore.getAllMembers()) { /*uses a for of loop taking in the details of all members using the getAllMembers command from member-store model.
                                                    These details are taken as variable m. For each member in the member-store.json the value of m.numAssessments is taken
                                                    as equal to the amount of Assessments attached to each member - using the getMemberAssessments command from assessment-store model*/
      m.numAssessments = assessmentStore.getMemberAssessments(m.id).length;
    }
    const viewData = { //creates viewData variable inside the index command
      title: "Trainer Dashboard", //adds a title to the website tab displaying as "Trainer Dashboard"
      assessments: assessmentStore.getAllAssessments(), /*displays Assessments using getAllAssessments command from assessment-store model. No longer
                                                          sure if this is necessary but do not wish to remove it in case any issues occur*/ 
      members: memberStore.getAllMembers() //displays members using getAllMembers command from member-store model
    };
    response.render("trainerdashboard", viewData); //command responds by rendering trainerdashboard view with the details of viewData
  },

  trainerMemberView(request, response) { /*creates trainerMemberView command which takes in a request loading the trainer's view of the corresponding
                                          member's dashboard from the member name clicked on and then responds by opening the trainer's view of the
                                          corresponding member's dashboard with their assessments and analytics*/
    logger.info("trainer member dashboard rendering"); //adds log stating member dashboard is rendering
    const loggedInTrainer = accounts.getCurrentTrainer(request); /*creates variable loggedInTrainer which takes getCurrentTrainer
                                                                command from accounts controller taking in the trainer who has logged in
                                                                on the previous page*/
    const member = request.params.id; //sets variable member by adding the member id of the member's name the trianer clicked on
    const assessments = assessmentStore.getMemberAssessments(member); /*uses details of above variable member and takes it into the
                                                                      getMemberAssessments method of assessment-store model*/
    const viewData = { //creates viewData variable inside the trainerMemberView command
      title: "Trainer Dashboard", //adds a title to the website tab displaying as "Trainer Dashboard"
      trainer: loggedInTrainer, //displays details of trainer as the details of the above loggedInTrainer variable
      member: member, //displays details of member as the details of the above member variable
      name: memberStore.getMemberById(member).name, //displays name as value of getMemberById command of member-store model taking in the above variable member and rendering it's name
      assessments: assessments.reverse(), //displays assessments as value of above assessments variable - adds reverse() command so always displayed in reverse chronological order
      bmi: gymUtility.bmi(member), //displays bmi as value of bmi command of gymutility util taking in the value of the member variable
      bmiCat: gymUtility.bmiCat(member), //details of currently viewed member is taken into bmiCat command of gymutility and member's current bmiCat is displayed.
      isIdealWeight: gymUtility.isIdealWeight(member) /*details of currently viewed member is taken into isIdealWeight command of gymutility and if member's
                                                      weight is in ideal range or not is displayed*/
    };
    response.render("trainermemberview", viewData); //renders the page displaying trainer's view of the corresponding member's dashboard, assessments and analytics
  },

  deleteMember(request, response) { /*creates deleteAssessment command which takes in a request by clicking on trash icon
                                        next to a Member and responding by deleting the Member*/
    const memberId = request.params.id; //variable which is set as the id of the Member the trainer is requesting to delete
    logger.debug(`Deleting Member ${memberId}`); //adds log stating deleting a Member
    memberStore.removeMember(memberId); /*uses removeMember command from member-store model taking in the value of memberId
                                        and deleting the corresponding member and member's assessments*/
    response.redirect("/trainerdashboard"); //once member is deleted the trainerdashboard is refreshed with deleted member's details removed.
  },

  comment(request, response) { /*creates comment command which takes in a request by entering the comment in comment field
                                then clicking on Add Comment button and responding by adding the comment to the associated assessment
                                in the assessment-store.json*/
    const memberId = request.params.id; //sets variable memberId as id of member corresponding to currently viewed assessment
    const member = memberStore.getMember(memberId); /*takes in value of memberId into getMember method of member-store model
                                                    and sets the corresponding member details as value of member*/
    const assessmentId = request.params.assessmentid; //sets variable assessmentId as id of the assessment currently attempting to add a comment to
    const assessment = assessmentStore.getAssessment(assessmentId); /*takes in value of assessmentId into getAssessment method of assessment-store model
                                                    and sets the corresponding assessment details as value of assessment*/
    const comment = { //creates comment variable inside comment method
      comment: request.body.comment //value of comment is set as the string entered into comment field in add comment form
    };
    logger.debug(`Updating Assessment with ${comment}`); //adds log saying updating Assessment with details of comment
    logger.debug(`Updating Assessment from Member ${memberId}`); //adds second log saying updating Assessment of particular member
    assessmentStore.comment(assessment, comment); /*takes in values of assessment and comment and putting them through comment method of
                                                  assessment-store model adding the comment to the corresponding assessment in the assessment-store.json*/
    response.redirect("/trainerdashboard/" + member.id + "/trainermemberview"); /*redirects webpage by firstly reopening trainerdashboard then taking
                                                                                the id of the member currently being viewed then reopening the
                                                                                trainermemberview view with that member's analytics and assessments*/
  }
};

module.exports = trainerdashboard; //this controller exports the full content of the dashboard const

"use strict"; //expression which enables javascript strict mode on the controller

const accounts = require("./accounts.js"); //variable calling commands from the accounts controller
const logger = require("../utils/logger"); //variable calling commands from the logger util
const gymUtility = require("../utils/gymutility"); //variable calling commands from the gymutility util
const assessmentStore = require("../models/assessment-store.js"); //variable calling commands from the assessment-store model
const memberStore = require("../models/member-store.js"); //variable calling commands from the member-store model
const trainerStore = require("../models/trainer-store.js"); //variable calling commands from the trainer-store model
const uuid = require("uuid"); //variable calling the pre-built system for Javascript to create Universally Unique IDentifiers

const trainerdashboard = {
  index(request, response) {
    logger.info("trainer dashboard rendering");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    for (const m of memberStore.getAllMembers()) {
      m.numAssessments = assessmentStore.getMemberAssessments(m.id).length;
    }
    const viewData = {
      title: "Trainer Dashboard",
      assessments: assessmentStore.getAllAssessments(),
      members: memberStore.getAllMembers()
    };
    response.render("trainerdashboard", viewData);
  },

  trainerMemberView(request, response) {
    logger.info("trainer member dashboard rendering");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const member = request.params.id;
    const assessments = assessmentStore.getMemberAssessments(member);
    const viewData = {
      title: "Trainer Dashboard",
      trainer: loggedInTrainer,
      member: member,
      name: memberStore.getMemberById(member).name,
      assessments: assessments.reverse(),
      bmi: gymUtility.bmi(member),
      bmiCat: gymUtility.bmiCat(member),
      isIdealWeight: gymUtility.isIdealWeight(member)
    };
    response.render("trainermemberview", viewData);
  },

  deleteMember(request, response) {
    const memberId = request.params.id;
    logger.debug(`Deleting Member ${memberId}`);
    memberStore.removeMember(memberId);
    response.redirect("/trainerdashboard");
  },

  comment(request, response) {
    const memberId = request.params.id;
    const member = memberStore.getMember(memberId);
    const assessmentId = request.params.assessmentid;
    const assessment = assessmentStore.getAssessment(assessmentId);
    const comment = {
      comment: request.body.comment
    };
    logger.debug(`Updating Assessment with ${comment}`);
    logger.debug(`Updating Assessment from Member ${memberId}`);
    assessmentStore.comment(assessment, comment);
    response.redirect("/trainerdashboard/" + member.id + "/trainermemberview");
  }
};

module.exports = trainerdashboard;

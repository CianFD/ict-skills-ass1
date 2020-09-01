"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const gymUtility = require("../utils/gymutility")
const assessmentStore = require("../models/assessment-store.js");
const memberStore = require("../models/member-store.js");
const trainerStore = require("../models/trainer-store.js");
const uuid = require("uuid");

const trainerdashboard = {
  index(request, response) {
    logger.info("trainer dashboard rendering");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    for (const m of memberStore.getAllMembers()) {
        m.numAssessments = assessmentStore.getMemberAssessments(m.id).length
    }
    const viewData = {
      title: "Trainer Dashboard",
      assessments: assessmentStore.getAllAssessments(),
      members: memberStore.getAllMembers(),
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
    const member = memberStore.getMemberById(request.params.id);
    const assessmentId = assessmentStore.getAssessment(request.params.id);
    const comment = {
      comment: request.body.comment
    };
    logger.debug('Adding comment to ${assessmentId}', comment)
    trainerStore.comment(comment);
    response.redirect("/trainermemberview");
  }
};
  
module.exports = trainerdashboard;
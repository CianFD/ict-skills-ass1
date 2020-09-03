"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store.js");
const memberStore = require("../models/member-store.js");
const uuid = require("uuid");
const gymUtility = require("../utils/gymutility.js");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    const viewData = {
      title: "Member Dashboard",
      member: memberStore.getMemberById(loggedInMember.id),
      assessments: assessmentStore.getMemberAssessments(loggedInMember.id).reverse(),
      bmi: gymUtility.bmi(loggedInMember.id),
      bmiCat: gymUtility.bmiCat(loggedInMember.id),
      isIdealWeight: gymUtility.isIdealWeight(loggedInMember.id)
    };
    logger.info("about to render ${memberid}");
    response.render("dashboard", viewData);
  },

  deleteAssessment(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    const assessmentId = request.params.id;
    logger.debug(`Deleting Assessment ${assessmentId}`);
    assessmentStore.removeAssessment(assessmentId);
    response.redirect("/dashboard");
  },

  addAssessment(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    const newAssessment = {
      id: uuid.v1(),
      memberId: loggedInMember.id,
      dateAndTime: new Date().toUTCString(),
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      thigh: Number(request.body.thigh),
      upperArm: Number(request.body.upperArm),
      waist: Number(request.body.waist),
      hips: Number(request.body.hips),
      trend: gymUtility.trend
    };
    logger.debug("Adding a new Assessment", newAssessment);
    assessmentStore.addAssessment(newAssessment);
    response.redirect("/dashboard");
  },

  edit(request, response) {
    logger.debug("rendering edit member form");
    response.render("editmember");
  },

  editMember(request, response) {
    const memberId = request.params.id;
    const member = accounts.getCurrentMember(request);
    const updatedMember = {
      email: request.body.email,
      name: request.body.name,
      address: request.body.address,
      gender: request.body.gender,
      password: request.body.password,
      height: request.body.height,
      startingWeight: request.body.startingWeight
    };
    logger.debug(`Updating ${member}`);
    memberStore.editMember(member, updatedMember);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;

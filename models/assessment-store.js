"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");
const memberStore = require("./member-store");

const assessmentStore = {
  store: new JsonStore("./models/assessment-store.json", {
    assessmentCollection: []
  }),
  collection: "assessmentCollection",

  getAllAssessments() {
    return this.store.findAll(this.collection);
  },

  getAssessment(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getSingleAssessment(memberId, assessmentId) {
    return this.store.findBy(this.collection, {memberId: memberId, assessmentId: assessmentId});
  },

  getMemberById(memberId) {
    return this.store.findBy(this.collection, { memberId: memberId });
  },

  getMemberAssessments(memberId) {
    return this.store.findBy(this.collection, { memberId: memberId });
  },

  addAssessment(assessment) {
    this.store.add(this.collection, assessment);
    this.store.save();
  },

  removeAssessment(id) {
    const assessment = this.getAssessment(id);
    this.store.remove(this.collection, assessment);
    this.store.save();
  },

  comment(assessment, comment) {
    assessment.comment = comment.comment;
    this.store.save();
  }
};

module.exports = assessmentStore;

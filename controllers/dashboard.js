"use strict";

const logger = require("../utils/logger");
const assessmentCollection = require("../models/member-store.js");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const viewData = {
      title: "Assessment Dashboard",
      members: assessmentCollection
    };
    logger.info("about to render", assessmentCollection);
    response.render("dashboard", viewData);
  }
};

module.exports = dashboard;

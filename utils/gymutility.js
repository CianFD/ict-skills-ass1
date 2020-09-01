"use strict";

const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store.js");
const memberStore = require("../models/member-store.js");
const uuid = require("uuid");

const gymutility = {
  bmi(id) {
    const member = memberStore.getMemberById(id);
    const assessments = assessmentStore.getMemberAssessments(id);
    if (assessments.length === 0) {
      const bmi = member.startingWeight/((member.height/100)*(member.height/100));
      return Math.round(bmi * 100) / 100;
    }
    else {
      const bmi = assessments[assessments.length-1].weight/((member.height/100)*(member.height/100));
      return Math.round(bmi * 100) / 100;
    }
  },
  
  bmiCat(id) {
    const member = memberStore.getMemberById(id);
    const assessments = assessmentStore.getMemberAssessments(id);
    const bmi = this.bmi(id);

        if (bmi < 16) {
            return "SEVERELY UNDERWEIGHT";
        }
        if (bmi >= 16 && bmi < 18.5) {
            return "UNDERWEIGHT";
        }
        if (bmi >= 18.5 && bmi < 25.0) {
            return "NORMAL";
        }
        if (bmi >= 25.0 && bmi < 30.0) {
            return "OVERWEIGHT";
        }
        if (bmi >= 30.0 && bmi < 35.0) {
            return "MODERATELY OBESE";
        }
        if (bmi >= 35.0) {
            return "SEVERELY OBESE";
        }
        return "NORMAL";
    },
  
  isIdealWeight(id) {
    const member = memberStore.getMemberById(id);
    const assessments = assessmentStore.getMemberAssessments(id);
    const minHeight = 60;
    let idealWeight = 45.5;
    const metersToInches = 39.3701;
    const kgPerExtraInch = 2.3;
    let isIdealBodyWeight = "";

        if (member.gender === (("Male") || ("male") || ("m"))) {
          idealWeight = 50;
        }
        else {
          idealWeight = 45.5;
        }
        if ((metersToInches * ((member.height/100))) > minHeight) {
          idealWeight += ((metersToInches * (member.height/100)) - 60) * kgPerExtraInch;
        }
        if (assessments.length === 0) {
          isIdealBodyWeight = (member.startingWeight <= (idealWeight+0.2)) && (member.startingWeight >= (idealWeight-0.2));
        }
        else {
          isIdealBodyWeight = (assessments[assessments.length-1].weight <= (idealWeight+0.2)) && (assessments[assessments.length-1].weight >= (idealWeight-0.2));
        }
        return isIdealBodyWeight;
  },
  
  trend(id) {
    const member = memberStore.getMemberById(id);
    const assessments = assessmentStore.getMemberAssessments(id);
    let trend = "";
    if (assessments.length>1) {
      trend = assessments[assessments.length - 2].weight > assessments[assessments.length - 1].weight;
    }
    return trend;
  }
}

module.exports = gymutility;
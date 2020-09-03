"use strict"; //expression which enables javascript strict mode on the controller

const logger = require("../utils/logger"); //variable calling commands from the logger util

const about = {
  //creates about variable
  index(request, response) {
    /*creates index command which takes in a request by clicking the
                              about menu button and then responds by opening the page*/
    logger.info("about rendering"); //adds message to log saying "about rendering"
    const viewData = {
      //creates viewData variable inside the index command
      title: "About" //shows title of website page shown in the Tab Name as About
    };
    response.render("about", viewData); //responds to the initial request by rendering the About Page.
  },

  trainerabout(request, response) {
    /*creates trainerabout command which takes in a request by clicking the
                              about menu button and then responds by opening the page*/
    logger.info("about rendering"); //adds message to log saying "about rendering"
    const viewData = {
      //creates viewData variable inside the index command
      title: "About" //shows title of website page shown in the Tab Name as About
    };
    response.render("trainerabout", viewData); //responds to the initial request by rendering the About Page.
  }
};

module.exports = about; //this controller exports the full content of the about const

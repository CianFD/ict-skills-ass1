"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");
const memberStore = require("./member-store");

const trainerStore = {
  store: new JsonStore("./models/trainer-store.json", { trainers: [] }),
  collection: "trainers",

  getAllTrainers() {
    return this.store.findAll(this.collection);
  },

  addTrainer(trainer) {
    this.store.add(this.collection, trainer);
    this.store.save();
  },

  removeTrainer(id) {
    const trainer = this.getTrainer(id);
    this.store.remove(this.collection, trainer);
    this.store.save();
  },

  removeMember(id) {
    const member = this.getMember(id);
    this.store.remove(this.collection, member);
    this.store.save();
  },

  getTrainer(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getTrainerById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  trainerCheckPassword(password) {
    return this.store.findOneBy(this.collection, { password: password });
  }
};

module.exports = trainerStore;

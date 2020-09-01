"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const memberStore = {
  store: new JsonStore("./models/member-store.json", { members: [] }),
  collection: "members",

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },
  
  removeMember(id) {
    const member = this.getMember(id);
    this.store.remove(this.collection, member);
    this.store.save();
  },
  
  getMember(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getMemberById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
  
  memberCheckPassword(password) {
    return this.store.findOneBy(this.collection, { password: password });
  },
  
  editMember(member, updatedMember) {
    member.name = updatedMember.name;
    member.email = updatedMember.email;
    member.password = updatedMember.password;
    member.address = updatedMember.address;
    member.gender = updatedMember.gender;
    member.height = updatedMember.height;
    member.startingWeight = updatedMember.startingWeight;
    this.store.save();
  }
  
  
};

module.exports = memberStore;


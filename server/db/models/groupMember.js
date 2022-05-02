const Sequelize = require("sequelize");
const db = require("../db");

const GroupMember = db.define("group_member", {
  conversationId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  joined: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  left: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

module.exports = GroupMember;
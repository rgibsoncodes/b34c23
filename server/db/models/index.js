const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const GroupMember = require("./groupMember");

// associations
User.belongsToMany(Conversation, { through: GroupMember });
Conversation.belongsToMany(User, { through: GroupMember });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message, 
  GroupMember,
};
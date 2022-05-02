const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const GroupMember = require("./groupMember");

// associations

User.hasMany(GroupMember);
GroupMember.belongsTo(User)
Conversation.hasMany(GroupMember);
GroupMember.belongsTo(Conversation)
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message, 
  GroupMember,
};
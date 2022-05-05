const { Op, Sequelize } = require("sequelize");
const db = require("../db");
const GroupMember = require("./groupMember");
const Message = require("./message");
const User = require("./user")

const Conversation = db.define("conversation", {
    conversationName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});
// find conversation given two user Ids

Conversation.findConversation = async function (convoName, groupMembers) {
  const conversations = await Conversation.findAll({
    where: {
      conversationName: {
        convoName
      },
    }
  });

  let targetConversation = null;

  if (conversations) {
    for (let i = 0; i < conversations.length; i++) {
      const convoJSON = conversations[i].toJSON();
      const convoGroupMembers = convoJSON.group_members.sort((a, b) => a.id - b.id);
      const comparisonGroupMembers = groupMembers.sort((a, b) => a.id - b.id);
      let isTarget = true;
      if (convoGroupMembers.length === comparisonGroupMembers.length) {
        for (let j = 0; j < convoGroupMembers.length; j++) {
          if (convoGroupMembers[j] !== comparisonGroupMembers[j]) {
            isTarget = false;
            break;
          }
        }
      } else {
        isTarget = false;
      }
      if (isTarget) {
        targetConversation = conversations[i];
        break;
      }
    }
  }
  // return conversation or null if it doesn't exist
  return targetConversation;
};

Conversation.findAllConversationsByGroupMember = async function(groupMember) {
    const conversation = await Conversation.findOne({
    where: {
      id: groupMember.conversationId,
    },
    attributes: ["id"],
    order: [[Message, "createdAt", "ASC"]],
    include: [
      { model: Message, order: ["createdAt", "ASC"] },
      {
        model: GroupMember,
        where: {
          id: {
            [Op.not]: groupMember.userId,
          },
        },
        required: false,
      },
    ],
  });
  return conversation;
}

module.exports = Conversation;
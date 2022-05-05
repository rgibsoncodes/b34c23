const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  read: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
        return this.getDataValue('read').split(';')
    },
    set(value) {
       value = [`${value}`];
       this.setDataValue('read', value.join(';'));
    },
    defaultValue: "",
  }
});

// Function became unnecessary

// Message.findMessage = async function (messageId) {
//     const message = await Message.findOne({ where: { id: messageId }});
//     // return message or null if it doesn't exist
//     return message;
// };

module.exports = Message;
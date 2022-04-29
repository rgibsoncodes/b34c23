const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");



// Async function to update read value of message.
const handleMessage = async (messageId) => {
  try {
    const databaseMessage = await Message.findMessage(messageId);
    databaseMessage.set({
        read: true,
    })
    await databaseMessage.save();
  } catch (error) {
    console.error(error);
  }
}

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender} = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
    try {
      const { firstUnreadMessage } = req.body;
      console.log(req.body)
      // checks if route was hit to simply update read statuses. 
      const messages = await Message.update(
        { read: true},
        { where: 
          {
            conversationId: firstUnreadMessage.conversationId, 
            createdAt: {
              [Op.gte]: firstUnreadMessage.createdAt
            } 
          },
        }
      )
      return res.sendStatus(204);
    } catch(error) {
      next(error)
    }
});

module.exports = router;

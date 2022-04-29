import React, { useMemo, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId, readMessage } = props;
  
  // finds the id of the message that needs avatar. 
  const lastUnreadMessageId = useMemo(() => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].read === true && messages[i].senderId !== otherUser.id) {
      return messages[i].id;
    }
  }
    return null;
  }, [messages, otherUser])

  useEffect(() => {
    const latest = messages[messages.length - 1];
    if (latest.senderId === otherUser.id && latest.read !== true) {
        readMessage(messages);
    }
  }, [lastUnreadMessageId, messages, readMessage, otherUser.id])

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');

        let withAvatar = false;
        if (lastUnreadMessageId && lastUnreadMessageId === message.id) {
            withAvatar = true;
        }

        return message.senderId === userId ? (
          <SenderBubble 
          key={message.id} 
          text={message.text} 
          time={time} 
          otherUser={otherUser}
          withAvatar={withAvatar}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;

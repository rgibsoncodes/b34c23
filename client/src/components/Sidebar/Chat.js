import React, {useMemo} from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';
import UnreadBubble from './UnreadBubble';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
}));

const Chat = ({ conversation, setActiveChat, setMessagesToRead, user }) => {
  const classes = useStyles();
  const { otherUser } = conversation;

  // Calculates the amount of unread messages by either hitting a true value or the other users message.
  const unreadMessages = useMemo(() => {
    for (let i = conversation.messages.length - 1; i >= 0; i--) {
        if (conversation.messages[i].read === true || conversation.messages[i].senderId === user.id) {
            return conversation.messages.length - (i + 1);
        }
    }
    return conversation.messages.length;
  }, [conversation.messages, user])

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser);
    if (unreadMessages > 0) {
        const payload = {
            unreadMessages: unreadMessages,
            conversationId: conversation.id,
        }
        setMessagesToRead(payload);
    }
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent isBold={unreadMessages ? true : false} conversation={conversation} />
      <UnreadBubble unreadMessages={unreadMessages}/>
    </Box>
  );
};

export default Chat;

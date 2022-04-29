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

const Chat = ({ conversation, setActiveChat, countUnreadMessages }) => {
  const classes = useStyles();
  const { otherUser } = conversation;

  const unreadMessages = countUnreadMessages(conversation.messages);

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser);
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

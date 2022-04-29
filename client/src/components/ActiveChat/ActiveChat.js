import React, {useEffect, useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Input, Header, Messages } from './index';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 8,
    flexDirection: 'column',
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
}));

const ActiveChat = ({
  user,
  conversations,
  activeConversation,
  postMessage,
  readMessage,
}) => {
    
    console.log("attmepted rendered")
  const classes = useStyles();
  
      const username = activeConversation ? activeConversation.username : null;
  console.log(conversations)
//   const conversation = useMemo((conversations) => {
//     console.log(conversations)
//     if (!conversations) return {};

//     const convo = conversations.find((conversation) => {
//         return conversation.otherUser.username === username;
//     });

//     return convo;
//   }, [activeConversation, conversations]);
const conversation = conversations
? conversations.find(
    (conversation) => conversation.otherUser.username === username
  )
: {};

  const isConversation = (obj) => {
    return obj !== {} && obj !== undefined;
  };
        
//   useEffect(() => {
//     try {
//         if (conversation.id) {
//             if (conversation.messages[conversation.messages.length - 1].senderId !== user.id) {
//                 readMessage(conversation.messages);
//             }
//         }
//     } catch(err) {
//         console.error(err)
//     }
//   }, [conversation, readMessage, user])

  return (
    <Box className={classes.root}>
      {isConversation(conversation) && conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            {user && (
              <>
                <Messages
                  messages={conversation.messages}
                  otherUser={conversation.otherUser}
                  userId={user.id}
                  readMessage={readMessage}
                />
                <Input
                  otherUser={conversation.otherUser}
                  conversationId={conversation.id || null}
                  user={user}
                  postMessage={postMessage}
                />
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;

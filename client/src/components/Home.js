import React, { useCallback, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Grid, CssBaseline, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SidebarContainer } from '../components/Sidebar';
import { ActiveChat } from '../components/ActiveChat';
import { SocketContext } from '../context/socket';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
}));

const Home = ({ user, logout }) => {
  const history = useHistory();

  const socket = useContext(SocketContext);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addSearchedUsers = (users) => {
    const currentUsers = {};

    // make table of current users so we can lookup faster
    conversations.forEach((convo) => {
      currentUsers[convo.otherUser.id] = true;
    });

    const newState = [...conversations];
    users.forEach((user) => {
      // only create a fake convo if we don't already have a convo with this user
      if (!currentUsers[user.id]) {
        let fakeConvo = { otherUser: user, messages: [] };
        newState.push(fakeConvo);
      }
    });

    setConversations(newState);
  };

  const clearSearchedUsers = () => {
    setConversations((prev) => prev.filter((convo) => convo.id));
  };

  const saveMessage = async (body) => {
    const { data } = await axios.post('/api/messages', body);
    return data;
  };

  const sendMessage = (data, body) => {
    socket.emit('new-message', {
      message: data.message,
      recipientId: body.recipientId,
      sender: data.sender,
    });
  };

  const sendReadMessage = (data) => {
      console.log("socker emitted a ton of times")
    socket.emit('read-message', {
        otherUserId: data.otherUserId,
        lastReadMessage: data.lastReadMessage,
    })
  }

  const countUnreadMessages = useCallback((messagesArr) => {
    for (let i = messagesArr.length - 1; i >= 0; i--) {
        if (messagesArr[i].read === true || messagesArr[i].senderId === user.id) {
            return messagesArr.length - (i + 1);
        }
    }
    return messagesArr.length;
  }, [user])

  const readMessage = (messagesArr) => {
      console.log(10000987)
    const unreadMessages = countUnreadMessages(messagesArr);
    const data = {
        unreadMessages: unreadMessages, 
        conversationId: messagesArr[0].conversationId, 
        lastReadMessage: messagesArr[messagesArr.length - unreadMessages],
    }
    sendReadMessage(data);
    setMessagesToRead(data);
  }

  const postMessage = async (body) => {
    try {
      const data = await saveMessage(body);
      if (!body.conversationId) {
        addNewConvo(body.recipientId, data.message);
      } else {
        addMessageToConversation(data);
      }
      sendMessage(data, body);
    } catch (error) {
      console.error(error);
    }
  };

  const addNewConvo = useCallback(
    (recipientId, message) => {
      let newConversations = [...conversations];
      let newestChatIndex;

      newConversations.forEach((convo, index) => {
        if (convo.otherUser.id === recipientId) {
          newestChatIndex = index;
          const messagesCopy = [...convo.messages, message];
          convo.messages = [...messagesCopy];
          convo.latestMessageText = message.text;
          convo.id = message.conversationId;
        }
      });

      const firstChat = newConversations[newestChatIndex];
      newConversations.splice(newestChatIndex, 1)
      
      setConversations(() => [firstChat, ...newConversations]);
    },
    [setConversations, conversations]
  );

  const addMessageToConversation = useCallback(
    (data) => {
      // if sender isn't null, that means the message needs to be put in a brand new convo
      const { message, sender = null } = data;
    //   if (activeConversation && message.senderId === activeConversation.id) {
    //       message.read = true;
    //   }
      if (sender !== null) {
        const newConvo = {
          id: message.conversationId,
          otherUser: sender,
          messages: [message],
        };
        newConvo.latestMessageText = message.text;
        setConversations((prev) => [newConvo, ...prev]);
      } else {
          let newConversations = [...conversations];
          let newestChatIndex;
    
          newConversations.forEach((convo, index) => {
            if (convo.id === message.conversationId) {
              newestChatIndex = index;
              const messagesCopy = [...convo.messages, message];
              convo.messages = [...messagesCopy];
              convo.latestMessageText = message.text;
            }
          });
    
          const firstChat = newConversations[newestChatIndex];
          newConversations.splice(newestChatIndex, 1)
          
          setConversations(() => [firstChat, ...newConversations]);
      }

    },
    [setConversations, conversations]
  );

  const setActiveChat = (user, socketPayload) => {
    setActiveConversation(user);
    if (socketPayload) readMessage(socketPayload);
  };

  const addOnlineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  const removeOfflineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  // Function hits backend to update messages in database and immediately updates front-end. 
  const setMessagesToRead = useCallback((updateMessageObject) => {
      const { unreadMessages, conversationId, lastReadMessage } = updateMessageObject;
      console.log("called set messages to read with", lastReadMessage)
    try {
      setConversations((prev) =>
        prev.map((convo) => {
          if (convo.id === conversationId) {
            const convoCopy = { ...convo };
            const updatedMessages = [...convoCopy.messages]
            const startIndex = updatedMessages.length - unreadMessages;
            for (let i = startIndex; i < updatedMessages.length; i++) {
                updatedMessages[i].read = true;
            }

            convoCopy.messages = [...updatedMessages];
            return convoCopy;
          } else {
            return convo;
          }
        })
      );
      
      const body = { firstUnreadMessage: lastReadMessage }
      axios.put('/api/messages', body);

    } catch (error) {
      console.error(error);
    }
  }, [setConversations])


  const updateReadMessages = useCallback((data) => {
      const { lastReadMessage } = data;
      console.log("called update messages", lastReadMessage)
      setConversations((prev) =>
      prev.map((convo) => {
        if (convo.id === lastReadMessage.conversationId) {
          const convoCopy = { ...convo };
          const updatedMessages = [...convoCopy.messages]
          const startIndex = updatedMessages.findIndex((message) => message.id === lastReadMessage.id);
          for (let i = startIndex; i < updatedMessages.length; i++) {
            //   if (updatedMessages[i].senderId === user.id) {
            //       break;
            //   }
              updatedMessages[i].read = true;
          }

          convoCopy.messages = [...updatedMessages];
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, [setConversations])

  // Lifecycle

  useEffect(() => {
    // Socket init
    socket.on('add-online-user', addOnlineUser);
    socket.on('remove-offline-user', removeOfflineUser);
    socket.on('new-message', addMessageToConversation);
    socket.on('read-message', updateReadMessages);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off('add-online-user', addOnlineUser);
      socket.off('remove-offline-user', removeOfflineUser);
      socket.off('new-message', addMessageToConversation);
      socket.off('read-message', updateReadMessages);
    };
  }, [addMessageToConversation, addOnlineUser, removeOfflineUser, socket]);

  useEffect(() => {
    // when fetching, prevent redirect
    if (user?.isFetching) return;

    if (user && user.id) {
      setIsLoggedIn(true);
    } else {
      // If we were previously logged in, redirect to login instead of register
      if (isLoggedIn) history.push('/login');
      else history.push('/register');
    }
  }, [user, history, isLoggedIn]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get('/api/conversations');
        setConversations(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!user.isFetching) {
      fetchConversations();
    }
  }, [user]);

  const handleLogout = async () => {
    if (user && user.id) {
      await logout(user.id);
    }
  };

  console.log(conversations)
  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer
          conversations={conversations}
          user={user}
          clearSearchedUsers={clearSearchedUsers}
          addSearchedUsers={addSearchedUsers}
          setActiveChat={setActiveChat}
          setMessagesToRead={setMessagesToRead}
          countUnreadMessages={countUnreadMessages}
        />
        <ActiveChat
          activeConversation={activeConversation}
          conversations={conversations}
          user={user}
          postMessage={postMessage}
          readMessage={readMessage}
        />
      </Grid>
    </>
  );
};

export default Home;
